create database sofia_api_jogos;
use sofia_api_jogos;

create table jogos(
	id int auto_increment primary key not null,
    nome varchar(200) not null, 
    desenvolvedora varchar(200) not null,
    sinopse varchar(700),
    genero_id int not null, foreign key (genero_id) references genero(id)
);

create table genero(
	id int auto_increment primary key not null,
    nome varchar(200) not null,
    descricao varchar(300) not null
)