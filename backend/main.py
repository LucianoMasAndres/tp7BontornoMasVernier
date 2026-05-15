from typing import List, Optional
from datetime import datetime, timedelta
from sqlmodel import Field, Session, SQLModel, create_engine, select
from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from jose import JWTError, jwt
import json

SECRET_KEY = "prog4-secret-key-2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer()


class ParticipanteBase(SQLModel):
    nombre: str
    email: str
    edad: int
    pais: str
    modalidad: str
    nivel: str
    aceptaTerminos: bool

class Participante(ParticipanteBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    tecnologias_str: str = Field(default="[]")

class ParticipanteRead(ParticipanteBase):
    id: int
    tecnologias: List[str]

class ParticipanteCreate(ParticipanteBase):
    tecnologias: List[str]

class Usuario(SQLModel, table=True):
    __tablename__ = "usuarios_db"
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    password: str
    rol: str

class LoginRequest(SQLModel):
    username: str
    password: str

class TokenResponse(SQLModel):
    token: str
    rol: str
    username: str


sqlite_url = "sqlite:///database.db"
engine = create_engine(sqlite_url, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def seed_users():
    with Session(engine) as session:
        if not session.exec(select(Usuario)).first():
            session.add(Usuario(username="admin", password=pwd_context.hash("admin123"), rol="ADMIN"))
            session.add(Usuario(username="consulta", password=pwd_context.hash("consulta123"), rol="CONSULTA"))
            session.commit()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def seed_participantes():
    with Session(engine) as session:
        if not session.exec(select(Participante)).first():
            participantes = [
                Participante(nombre="Ana Gómez", email="ana@gmail.com", edad=26, pais="Argentina", modalidad="Virtual", nivel="Avanzado", aceptaTerminos=True, tecnologias_str='["React", "TypeScript"]'),
                Participante(nombre="Carlos Pérez", email="carlos@gmail.com", edad=31, pais="Chile", modalidad="Presencial", nivel="Intermedio", aceptaTerminos=True, tecnologias_str='["Python", "FastAPI"]'),
                Participante(nombre="Lucía Fernández", email="lucia@gmail.com", edad=22, pais="Uruguay", modalidad="Híbrido", nivel="Principiante", aceptaTerminos=True, tecnologias_str='["HTML", "CSS"]'),
                Participante(nombre="Matías Torres", email="matias@gmail.com", edad=28, pais="Argentina", modalidad="Virtual", nivel="Avanzado", aceptaTerminos=True, tecnologias_str='["Node.js", "PostgreSQL", "Docker"]'),
                Participante(nombre="Valentina Ruiz", email="vale@gmail.com", edad=24, pais="Bolivia", modalidad="Presencial", nivel="Intermedio", aceptaTerminos=True, tecnologias_str='["Vue.js", "MySQL"]'),
                Participante(nombre="Diego Salinas", email="diego@gmail.com", edad=35, pais="Argentina", modalidad="Virtual", nivel="Avanzado", aceptaTerminos=True, tecnologias_str='["Java", "Spring Boot", "AWS"]'),
                Participante(nombre="Florencia López", email="flor@gmail.com", edad=20, pais="Paraguay", modalidad="Híbrido", nivel="Principiante", aceptaTerminos=True, tecnologias_str='["JavaScript"]'),
                Participante(nombre="Nicolás Hassan", email="nico@gmail.com", edad=27, pais="Argentina", modalidad="Virtual", nivel="Intermedio", aceptaTerminos=True, tecnologias_str='["React", "Node.js"]'),
            ]
            for p in participantes:
                session.add(p)
            session.commit()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    seed_users()
    seed_participantes()

def get_session():
    with Session(engine) as session:
        yield session

def create_token(username: str, rol: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({"sub": username, "rol": rol, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(bearer_scheme)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        rol = payload.get("rol")
        if not username:
            raise HTTPException(status_code=401, detail="Token inválido")
        return {"username": username, "rol": rol}
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")


@app.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(Usuario).where(Usuario.username == request.username)).first()
    if not user or not pwd_context.verify(request.password, user.password):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    token = create_token(user.username, user.rol)
    return TokenResponse(token=token, rol=user.rol, username=user.username)


@app.get("/participantes", response_model=List[ParticipanteRead])
def get_participantes(session: Session = Depends(get_session), user=Depends(get_current_user)):
    participantes = session.exec(select(Participante)).all()
    res = []
    for p in participantes:
        p_dict = p.model_dump()
        p_dict["tecnologias"] = json.loads(p.tecnologias_str)
        res.append(ParticipanteRead(**p_dict))
    return res

@app.post("/participantes", response_model=ParticipanteRead)
def create_participante(participante: ParticipanteCreate, session: Session = Depends(get_session), user=Depends(get_current_user)):
    if user["rol"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Solo ADMIN puede crear participantes")
    db_p = Participante(
        nombre=participante.nombre,
        email=participante.email,
        edad=participante.edad,
        pais=participante.pais,
        modalidad=participante.modalidad,
        nivel=participante.nivel,
        aceptaTerminos=participante.aceptaTerminos,
        tecnologias_str=json.dumps(participante.tecnologias)
    )
    session.add(db_p)
    session.commit()
    session.refresh(db_p)
    p_dict = db_p.model_dump()
    p_dict["tecnologias"] = json.loads(db_p.tecnologias_str)
    return ParticipanteRead(**p_dict)

@app.put("/participantes/{id}", response_model=ParticipanteRead)
def update_participante(id: int, participante: ParticipanteCreate, session: Session = Depends(get_session), user=Depends(get_current_user)):
    if user["rol"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Solo ADMIN puede editar participantes")
    db_p = session.get(Participante, id)
    if not db_p:
        raise HTTPException(status_code=404, detail="Participante no encontrado")
    db_p.nombre = participante.nombre
    db_p.email = participante.email
    db_p.edad = participante.edad
    db_p.pais = participante.pais
    db_p.modalidad = participante.modalidad
    db_p.nivel = participante.nivel
    db_p.aceptaTerminos = participante.aceptaTerminos
    db_p.tecnologias_str = json.dumps(participante.tecnologias)
    session.add(db_p)
    session.commit()
    session.refresh(db_p)
    p_dict = db_p.model_dump()
    p_dict["tecnologias"] = json.loads(db_p.tecnologias_str)
    return ParticipanteRead(**p_dict)

@app.delete("/participantes/{id}")
def delete_participante(id: int, session: Session = Depends(get_session), user=Depends(get_current_user)):
    if user["rol"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Solo ADMIN puede eliminar participantes")
    participante = session.get(Participante, id)
    if not participante:
        raise HTTPException(status_code=404, detail="Participante no encontrado")
    session.delete(participante)
    session.commit()
    return {"ok": True}
