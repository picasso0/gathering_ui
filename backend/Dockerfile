FROM python:3.10
RUN mkdir -p /backend
WORKDIR /backend

COPY backend/requirements.txt .
RUN pip install -r ./requirements.txt

COPY . /backend

# CMD ["tail","-f","/dev/null"]

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8885","--reload" ]
#CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "80"]
