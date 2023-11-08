# import pytho3n 3.10 image
FROM python:3.10

# expose port 5000 for flask
EXPOSE 5000

# creates and changes directory to /app in docker container
WORKDIR /app

#  copies files from current directory to docker
COPY requirements.txt /app

RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install -r requirements.txt

COPY . /app

ENTRYPOINT ["python3"]
CMD ["app.py"]
# CMD flask --name main --debug run
