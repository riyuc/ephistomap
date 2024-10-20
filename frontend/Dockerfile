FROM jarredsumner/bun:edge

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .

RUN bun build

EXPOSE 3000

CMD ["bun", "start"]