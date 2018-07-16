# YouTube Archiver

ToDo: Stuff

Guide for Mollusk

```sh
git clone https://github.com/TundraFizz/YouTube-Archiver
docker build -t youtube-archiver YouTube-Archiver
mkdir youtube-archiver

# docker-compose.yml
  youtube-archiver:
    image: youtube-archiver
    volumes:
      - ./youtube-archiver:/usr/src/app/src/videos

bash mollusk.sh nconf -c youtube-archiver -s example.com
docker stack deploy -c docker-compose.yml STACK_NAME
bash mollusk.sh ssl -d example.com -se youtube-archiver -st STACK_NAME -s
```
