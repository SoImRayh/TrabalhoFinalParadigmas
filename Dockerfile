# imagem do node usando a versão lts 18
FROM  node:18-alpine AS builder

#criando um diretorio para armazenar a aplicação dentro do container:
WORKDIR /app

#adicionando '/app/node_modules/.bin' para o $PATH

#instalando depedências da aplicação e armazenamento em cache.

COPY . .

## silenciar os problemas na instalaçãose usa '--silent'
RUN npm i yarn
RUN yarn
RUN yarn run build


#fazendo o start da imagem final usando a imagem do nginx
FROM nginx

#com o comando RUN yarn build se gera a pasta /dist o que se faz e copiar o final dela para a pasta padrao do nginx
COPY --from=builder /app/dist /usr/share/nginx/html/

##retirando as configurações padrôes do nginx
RUN rm /etc/nginx/conf.d/default.conf

# copiando nossas configurações para substituir as configs padrões do nginx
COPY deploy/nginx/nginx.conf /etc/nginx/conf.d

#expondo a porta 80
EXPOSE 80

#iniciando a aplicação:
CMD ["nginx", "-g", "daemon off"]
