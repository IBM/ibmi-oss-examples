FROM python:3.9-buster

WORKDIR /app

COPY . .

RUN useradd -ms /bin/bash runner

USER runner

RUN pip install -r requirements.txt --user

CMD [ "python", "./main.py" ]
