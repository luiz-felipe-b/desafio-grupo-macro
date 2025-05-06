CREATE TABLE "ceps" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"cep" varchar(9) NOT NULL,
	"logradouro" text NOT NULL,
	"complemento" text,
	"unidade" text,
	"bairro" text NOT NULL,
	"localidade" text NOT NULL,
	"uf" varchar(2) NOT NULL,
	"estado" text NOT NULL,
	"regiao" text NOT NULL,
	"ibge" text,
	"gia" text,
	"ddd" varchar(2),
	"siafi" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ceps_cep_unique" UNIQUE("cep")
);
