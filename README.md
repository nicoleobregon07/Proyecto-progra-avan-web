# Proyecto Avanzada Web - Juego Connect4

## 👥 Integrantes del Grupo

- **Nombre:** Elsbe Nicole Obregón Munguía  
  - **Carné:** FI22024693  
  - **Usuario GitHub:** [nicoleobregon07](https://github.com/nicoleobregon07)  
  - **Correo Git:** nicoleobregon07@gmail.com

- **Nombre:** Kevin Alberto Calvo Brenes
  - **Carné:** FI23028470
  - **Usuario GitHub:** [KevinC-B](https://github.com/KevinC-B)  
  - **Correo Git:** kev170103@gmail.com

---

## 🧰 Frameworks y Herramientas Utilizadas

- **Backend**:
  - Flask (Python)
  - oracledb (conector a Oracle Database)
- **Frontend**:
  - HTML5, CSS3, Bootstrap 5
  - JavaScript (AJAX)
- **Base de Datos**:
  - Oracle SQL (SQL Developer)
- **Otras herramientas**:
  - GitHub
  - Visual Studio Code

---

## 🌐 Tipo de Aplicación

- **MPA** (Multi Page Application)

---

## 🏛️ Arquitectura

- **MVC** (Modelo - Vista - Controlador):  
  La aplicación usa `app.py` como controlador principal, plantillas HTML como vistas, y Oracle como modelo (base de datos). Todo está organizado por rutas Flask que conectan las vistas con la lógica de negocio.

---

## 🗂️ Diagrama de la Base de Datos (Mermaid)
![alt text](<Untitled diagram _ Mermaid Chart-2025-07-09-012746.png>)
```mermaid
erDiagram
    Jugadores ||--o{ Partidas : "Jugador1Id"
    Jugadores ||--o{ Partidas : "Jugador2Id"
    Jugadores ||--o{ Partidas : "GanadorId"
    Partidas ||--o{ Movimientos : "PartidaId"
    Jugadores ||--o{ Movimientos : "JugadorId"

    Jugadores {
        number JugadorId PK
        number Identificacion
        string Nombre
        number Marcador
    }

    Partidas {
        number PartidaId PK
        number Jugador1Id FK
        number Jugador2Id FK
        datetime FechaInicio
        string Estado
        number GanadorId FK
    }

    Movimientos {
        number MovimientoId PK
        number PartidaId FK
        number JugadorId FK
        string Columna
        number Fila
        number Turno
        datetime FechaHora
    }

⚙️ Instrucciones de Instalación, Configuración y Ejecución
1. 🧱 Crear usuario y base de datos en Oracle
Desde CMD con SQL*Plus:


Copiar:

sqlplus sys as sysdba

sql
Copiar

-- Crear usuario
CREATE USER PROYECTOPROGRA IDENTIFIED BY PROYECTOPROGRA;

-- Dar permiso de sesión
GRANT CREATE SESSION TO PROYECTOPROGRA;

-- Dar todos los privilegios
GRANT ALL PRIVILEGES TO PROYECTOPROGRA;

1.3 📄 Crear conexión en SQL Developer
Abre SQL Developer, crea una nueva conexión:

Nombre de conexión: cualquier nombre (ej. ConexionProgra)

Usuario / Contraseña: PROYECTOPROGRA

SID: orcl

Guarda y conecta.
Ejemplo
![alt text](image.png)

2. 🧱 Crear las tablas necesarias
sql
Copiar
Editar
CREATE TABLE Jugadores (
    JugadorId NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Identificacion NUMBER UNIQUE NOT NULL,
    Nombre VARCHAR2(100) NOT NULL,
    Marcador NUMBER DEFAULT 0
);

CREATE TABLE Partidas (
    PartidaId NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Jugador1Id NUMBER NOT NULL,
    Jugador2Id NUMBER NOT NULL,
    FechaInicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Estado VARCHAR2(20) DEFAULT 'EN_CURSO',
    GanadorId NUMBER,
    FOREIGN KEY (Jugador1Id) REFERENCES Jugadores(JugadorId),
    FOREIGN KEY (Jugador2Id) REFERENCES Jugadores(JugadorId),
    FOREIGN KEY (GanadorId) REFERENCES Jugadores(JugadorId)
);

CREATE TABLE Movimientos (
    MovimientoId NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    PartidaId NUMBER NOT NULL,
    JugadorId NUMBER NOT NULL,
    Columna VARCHAR2(1) NOT NULL,
    Fila NUMBER NOT NULL,
    Turno NUMBER NOT NULL,
    FechaHora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PartidaId) REFERENCES Partidas(PartidaId),
    FOREIGN KEY (JugadorId) REFERENCES Jugadores(JugadorId)
);

3. 🐍 Instalar Python y paquetes necesarios
Desde la terminal, ejecutar:


Copiar:

pip install flask oracledb

4. 📂 Clonar repositorio

Copiar

git clone https://github.com/nicoleobregon07/ProyectoProgra-Web.git

5. ⚙️ Configurar conexión a Oracle
Editar el archivo app.py en la función get_db_connection():



Editar
def get_db_connection():
    return oracledb.connect(
        user="PROYECTOPROGRA",
        password="PROYECTOPROGRA",
        dsn="localhost:1521/orcl"
    )


6. 🚀 Ejecutar la aplicación

Desde el archivo app.py

python app.py
Luego abrir navegador y visitar:

![alt text](image-1.png)

Editar
----http://localhost:5000/----
![alt text](image-2.png)
📚 Referencias y Prompts AI utilizados