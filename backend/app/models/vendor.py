from sqlalchemy import Column, Integer, String, JSON, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, relationship
import datetime

Base = declarative_base()

class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)
    domain = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    risk_score = Column(Integer, nullable=True)
    mitigation_playbook = Column(JSON, nullable=True)
    raw_api_data = Column(JSON, nullable=True)
    
    # Relationship to alerts
    alerts = relationship("Alert", back_populates="vendor", cascade="all, delete-orphan")

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    title = Column(String)
    severity = Column(String) # Critical, High, Medium, Low
    status = Column(String, default="Open") # Open, Investigating, Resolved
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    vendor = relationship("Vendor", back_populates="alerts")

# Using SQLite locally
engine = create_engine("sqlite:///./vigilink.db", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)