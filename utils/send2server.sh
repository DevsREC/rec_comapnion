sudo rsync -a --exclude 'node_modules/' --exclude '__pycache__' ./new_rec_companion_app raven@debian-server:~/ --info=progress2
ssh raven@debian-server docker compose -f /home/raven/new_rec_companion_app/docker-compose.yml up --build -d
