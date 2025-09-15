import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1747761341650 implements MigrationInterface {
    name = 'InitialSchema1747761341650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "unidad" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "abreviatura" character varying(20), CONSTRAINT "PK_3f087c90fe8ce6bafe8f8af6779" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tipo_producto" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, CONSTRAINT "UQ_9ce6fa590aea86a7c53079f5f42" UNIQUE ("nombre"), CONSTRAINT "PK_d62b06089b9920ad82b217cba97" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "productos" ("id" SERIAL NOT NULL, "nombre" character varying(255) NOT NULL, "precio_base" numeric(12,2) NOT NULL, "unidad_id" integer NOT NULL, "tipo_producto_id" integer NOT NULL, "descripcion" text, "vacio" boolean NOT NULL DEFAULT false, "oferta" boolean NOT NULL DEFAULT false, "precio_oferta" numeric(12,2), "activo" boolean NOT NULL DEFAULT true, "imagen" character varying(500), "precio_vacio" numeric(12,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id_interno" character varying(100) NOT NULL, CONSTRAINT "UQ_b879d3120c38c1fa4776e81f40e" UNIQUE ("id_interno"), CONSTRAINT "PK_04f604609a0949a7f3b43400766" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "precio_producto_lista" ("id" SERIAL NOT NULL, "lista_id" integer NOT NULL, "producto_id" integer NOT NULL, "precio_unitario" numeric(12,2) NOT NULL, CONSTRAINT "PK_3327bdf52876009eea187c96b6f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "listas_precios" ("id" SERIAL NOT NULL, "nombre" character varying(255) NOT NULL, "fecha" date NOT NULL, CONSTRAINT "PK_18ae3998ed418df1caf872485d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, CONSTRAINT "UQ_a5be7aa67e759e347b1c6464e10" UNIQUE ("nombre"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usuario_rol" ("id" SERIAL NOT NULL, "usuario_id" integer NOT NULL, "rol_id" integer NOT NULL, CONSTRAINT "PK_6c336b0a51b5c4d22614cb02533" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" SERIAL NOT NULL, "nombre" character varying(255) NOT NULL, "usuario" character varying(100) NOT NULL, "clave_hash" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "cliente_id" integer, CONSTRAINT "UQ_0790a401b9d234fa921e9aa1777" UNIQUE ("usuario"), CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clientes" ("id" SERIAL NOT NULL, "nombre" character varying(255) NOT NULL, "telefono" character varying(50) NOT NULL, "direccion" character varying(500) NOT NULL, "tipo" character varying(50) NOT NULL, "descuento" numeric(12,2) NOT NULL, "saldo_cuenta_corriente" numeric(14,2) NOT NULL, "lista_precios_id" integer, CONSTRAINT "PK_d76bf3571d906e4e86470482c08" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pedidos" ("id" SERIAL NOT NULL, "cliente_id" integer NOT NULL, "usuario_id" integer NOT NULL, "fecha_hora" TIMESTAMP NOT NULL, "canal" character varying(50) NOT NULL, "estado" character varying(50) NOT NULL, "armador_id" integer, "entregador_id" integer, "estado_pago" character varying(50) NOT NULL, CONSTRAINT "PK_ebb5680ed29a24efdc586846725" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "items_pedido" ("id" SERIAL NOT NULL, "pedido_id" integer NOT NULL, "producto_id" integer NOT NULL, "cantidad" integer NOT NULL, "precio_unitario" numeric(12,2) NOT NULL, CONSTRAINT "PK_3926c27c228ea78dd527e2d5fc6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "configuracion_horaria" ("id" SERIAL NOT NULL, "dia" character varying(20) NOT NULL, "hora_inicio" TIME NOT NULL, "hora_fin" TIME NOT NULL, "habilitado" boolean NOT NULL, CONSTRAINT "PK_b002991cb1689be2e5c0d5116b1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "facturas" ("id" SERIAL NOT NULL, "pedido_id" integer NOT NULL, "total" numeric(14,2) NOT NULL, "fecha_pago" TIMESTAMP NOT NULL, "forma_pago" character varying(50) NOT NULL, "legal" boolean NOT NULL, CONSTRAINT "PK_f302947c1e4773639b20707a8bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movimientos_cuenta_corriente" ("id" SERIAL NOT NULL, "cliente_id" integer NOT NULL, "fecha" TIMESTAMP NOT NULL, "monto" numeric(14,2) NOT NULL, "descripcion" text, "tipo_movimiento" character varying(50) NOT NULL, CONSTRAINT "PK_eefd15b660dc4ad8761dcacf532" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pedidos_manuales" ("id" SERIAL NOT NULL, "cliente_id" integer NOT NULL, "usuario_id" integer NOT NULL, "mensaje_original" text NOT NULL, "fecha_carga" TIMESTAMP NOT NULL, "pedido_id" integer, CONSTRAINT "PK_5a800b7b3539d28a6e619efd3d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "precios_del_dia" ("lista_id" integer NOT NULL, "producto_id" integer NOT NULL, "fecha" date NOT NULL, "precio_unitario" numeric(12,2) NOT NULL, CONSTRAINT "PK_0a14d9eb1d433db7fa34bc5b6aa" PRIMARY KEY ("lista_id", "producto_id", "fecha"))`);
        await queryRunner.query(`CREATE TABLE "productos_mas_vendidos" ("producto_id" integer NOT NULL, "nombre" character varying(255) NOT NULL, "cantidad_total" integer NOT NULL, "ingresos_generados" numeric(14,2) NOT NULL, CONSTRAINT "PK_df8f88c823b493031fa28cd8db1" PRIMARY KEY ("producto_id"))`);
        await queryRunner.query(`CREATE TABLE "stock" ("id" SERIAL NOT NULL, "producto_id" integer NOT NULL, "cantidad_disponible" integer NOT NULL, "ultima_actualizacion" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_092bc1fc7d860426a1dec5aa8e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tickets_armado" ("id" SERIAL NOT NULL, "pedido_id" integer NOT NULL, "usuario_id" integer NOT NULL, "hora_generacion" TIMESTAMP NOT NULL DEFAULT now(), "observaciones" text, CONSTRAINT "PK_54c0f3b3ed354551901685bc475" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ventas_mensuales" ("mes" date NOT NULL, "total_ventas" numeric(14,2) NOT NULL, "cantidad_facturas" integer NOT NULL, CONSTRAINT "PK_a15ae2c821d449795de0bdb16c4" PRIMARY KEY ("mes"))`);
        await queryRunner.query(`ALTER TABLE "productos" ADD CONSTRAINT "FK_48e598520f1331b575af7ad4a3d" FOREIGN KEY ("unidad_id") REFERENCES "unidad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "productos" ADD CONSTRAINT "FK_f66e547b5ff945b8eb4512aa58c" FOREIGN KEY ("tipo_producto_id") REFERENCES "tipo_producto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "precio_producto_lista" ADD CONSTRAINT "FK_21c9f3fd34665c2c46f850e5d74" FOREIGN KEY ("lista_id") REFERENCES "listas_precios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "precio_producto_lista" ADD CONSTRAINT "FK_d2bd1cdc81b3fad494318f926f0" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuario_rol" ADD CONSTRAINT "FK_29e9a9079c7ba01c1b301cf5555" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuario_rol" ADD CONSTRAINT "FK_ac8911cd54a61461c9926541401" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD CONSTRAINT "FK_5f4dc9b4cf1f7993658c5c22927" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clientes" ADD CONSTRAINT "FK_41a63ab5953a3f4d1d5c1d7f52d" FOREIGN KEY ("lista_precios_id") REFERENCES "listas_precios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD CONSTRAINT "FK_2fc639de84f845569ac2c9f78aa" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD CONSTRAINT "FK_44db92bd8242455d454c1d2c5d9" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD CONSTRAINT "FK_efa7ac82b455e5970a64a874d1b" FOREIGN KEY ("armador_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD CONSTRAINT "FK_d9afd5fd6dd66d395c0f39e7148" FOREIGN KEY ("entregador_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items_pedido" ADD CONSTRAINT "FK_9d6111ce5c8e863b1d039bc03af" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items_pedido" ADD CONSTRAINT "FK_5286a68c2a056ed749942d3d72c" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "facturas" ADD CONSTRAINT "FK_76a6e97aadf9de7bcafa310c635" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimientos_cuenta_corriente" ADD CONSTRAINT "FK_3c53fe89e845bea53647e9715bd" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pedidos_manuales" ADD CONSTRAINT "FK_b112a50a4162fed0c7a0369cb78" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pedidos_manuales" ADD CONSTRAINT "FK_ceee192ea48582155f91da2317e" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pedidos_manuales" ADD CONSTRAINT "FK_75a4a3a28c9bfe606115dfb5bac" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "precios_del_dia" ADD CONSTRAINT "FK_8ece5e2ec02658b8c9671821346" FOREIGN KEY ("lista_id") REFERENCES "listas_precios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "precios_del_dia" ADD CONSTRAINT "FK_206591a57d2cabc19a0c98e4e91" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "productos_mas_vendidos" ADD CONSTRAINT "FK_df8f88c823b493031fa28cd8db1" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock" ADD CONSTRAINT "FK_dafa790e6b13a93401ca6042f01" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets_armado" ADD CONSTRAINT "FK_4ad218ad87cbe6ab275bf55d1a0" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets_armado" ADD CONSTRAINT "FK_c0ba1b69708f49a1c5658728ea6" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets_armado" DROP CONSTRAINT "FK_c0ba1b69708f49a1c5658728ea6"`);
        await queryRunner.query(`ALTER TABLE "tickets_armado" DROP CONSTRAINT "FK_4ad218ad87cbe6ab275bf55d1a0"`);
        await queryRunner.query(`ALTER TABLE "stock" DROP CONSTRAINT "FK_dafa790e6b13a93401ca6042f01"`);
        await queryRunner.query(`ALTER TABLE "productos_mas_vendidos" DROP CONSTRAINT "FK_df8f88c823b493031fa28cd8db1"`);
        await queryRunner.query(`ALTER TABLE "precios_del_dia" DROP CONSTRAINT "FK_206591a57d2cabc19a0c98e4e91"`);
        await queryRunner.query(`ALTER TABLE "precios_del_dia" DROP CONSTRAINT "FK_8ece5e2ec02658b8c9671821346"`);
        await queryRunner.query(`ALTER TABLE "pedidos_manuales" DROP CONSTRAINT "FK_75a4a3a28c9bfe606115dfb5bac"`);
        await queryRunner.query(`ALTER TABLE "pedidos_manuales" DROP CONSTRAINT "FK_ceee192ea48582155f91da2317e"`);
        await queryRunner.query(`ALTER TABLE "pedidos_manuales" DROP CONSTRAINT "FK_b112a50a4162fed0c7a0369cb78"`);
        await queryRunner.query(`ALTER TABLE "movimientos_cuenta_corriente" DROP CONSTRAINT "FK_3c53fe89e845bea53647e9715bd"`);
        await queryRunner.query(`ALTER TABLE "facturas" DROP CONSTRAINT "FK_76a6e97aadf9de7bcafa310c635"`);
        await queryRunner.query(`ALTER TABLE "items_pedido" DROP CONSTRAINT "FK_5286a68c2a056ed749942d3d72c"`);
        await queryRunner.query(`ALTER TABLE "items_pedido" DROP CONSTRAINT "FK_9d6111ce5c8e863b1d039bc03af"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP CONSTRAINT "FK_d9afd5fd6dd66d395c0f39e7148"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP CONSTRAINT "FK_efa7ac82b455e5970a64a874d1b"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP CONSTRAINT "FK_44db92bd8242455d454c1d2c5d9"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP CONSTRAINT "FK_2fc639de84f845569ac2c9f78aa"`);
        await queryRunner.query(`ALTER TABLE "clientes" DROP CONSTRAINT "FK_41a63ab5953a3f4d1d5c1d7f52d"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP CONSTRAINT "FK_5f4dc9b4cf1f7993658c5c22927"`);
        await queryRunner.query(`ALTER TABLE "usuario_rol" DROP CONSTRAINT "FK_ac8911cd54a61461c9926541401"`);
        await queryRunner.query(`ALTER TABLE "usuario_rol" DROP CONSTRAINT "FK_29e9a9079c7ba01c1b301cf5555"`);
        await queryRunner.query(`ALTER TABLE "precio_producto_lista" DROP CONSTRAINT "FK_d2bd1cdc81b3fad494318f926f0"`);
        await queryRunner.query(`ALTER TABLE "precio_producto_lista" DROP CONSTRAINT "FK_21c9f3fd34665c2c46f850e5d74"`);
        await queryRunner.query(`ALTER TABLE "productos" DROP CONSTRAINT "FK_f66e547b5ff945b8eb4512aa58c"`);
        await queryRunner.query(`ALTER TABLE "productos" DROP CONSTRAINT "FK_48e598520f1331b575af7ad4a3d"`);
        await queryRunner.query(`DROP TABLE "ventas_mensuales"`);
        await queryRunner.query(`DROP TABLE "tickets_armado"`);
        await queryRunner.query(`DROP TABLE "stock"`);
        await queryRunner.query(`DROP TABLE "productos_mas_vendidos"`);
        await queryRunner.query(`DROP TABLE "precios_del_dia"`);
        await queryRunner.query(`DROP TABLE "pedidos_manuales"`);
        await queryRunner.query(`DROP TABLE "movimientos_cuenta_corriente"`);
        await queryRunner.query(`DROP TABLE "facturas"`);
        await queryRunner.query(`DROP TABLE "configuracion_horaria"`);
        await queryRunner.query(`DROP TABLE "items_pedido"`);
        await queryRunner.query(`DROP TABLE "pedidos"`);
        await queryRunner.query(`DROP TABLE "clientes"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
        await queryRunner.query(`DROP TABLE "usuario_rol"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "listas_precios"`);
        await queryRunner.query(`DROP TABLE "precio_producto_lista"`);
        await queryRunner.query(`DROP TABLE "productos"`);
        await queryRunner.query(`DROP TABLE "tipo_producto"`);
        await queryRunner.query(`DROP TABLE "unidad"`);
    }

}
