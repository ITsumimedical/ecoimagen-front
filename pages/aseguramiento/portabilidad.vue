<template>
    <v-tabs centered color="white" icons-and-text>
        <v-tabs-slider color="primary"></v-tabs-slider>

        <v-tab href="#tab-1" class="black--text">
            Entrada
            <v-icon color="black">mdi-clipboard-text</v-icon>
        </v-tab>

        <v-tab href="#tab-2" class="black--text">
            Salida
            <v-icon color="black">mdi-clipboard-text</v-icon>
        </v-tab>

        <v-tab href="#tab-3" class="black--text">
            Historicos
            <v-icon color="black">mdi-clipboard-text</v-icon>
        </v-tab>

        <!-- preload -->
        <template>
            <div class="text-center">
                <v-dialog v-model="preload" persistent width="300">
                    <v-card color="primary" dark>
                        <v-card-text>
                            Tranquilo procesamos tu solicitud !
                            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </div>
        </template>

        <!-- Boton para abrir modal para crear una portabilidad de entrada -->
        <v-tab-item :value="'tab-1'">
            <v-card class="mx-100">
                <div>
                    <v-toolbar flat>
                        <v-spacer></v-spacer>
                        <v-btn color="success" class="white--text ma-2 px-6" small
                            @click="abrilModalEntrada('crear')">Crear<v-icon>
                                mdi-plus</v-icon>
                        </v-btn>
                    </v-toolbar>

                    <v-row class="mx-2">
                        <v-col md="3" lg="3" xl="3" sm="6" cols>
                            <v-text-field dense v-model="filtro.documento" label="Documento" outlined>
                            </v-text-field>
                        </v-col>

                        <v-col md="3" lg="3" xl="3" sm="6" cols>
                            <v-text-field dense v-model="filtro.nombre_afiliado" label="Nombre Afiliado" outlined>
                            </v-text-field>
                        </v-col>

                        <v-col md="3" lg="3" xl="3" sm="6" cols>
                            <v-text-field dense v-model="filtro.entidad" label="IPS Portabilidad" outlined>
                            </v-text-field>
                        </v-col>

                        <v-col md="2" lg="2" xl="2" sm="6" cols>
                            <v-btn-toggle background-color="white" dark>
                                <v-btn small color="success" @click="listarPortabilidadEntrada()">Filtrar</v-btn>
                                <v-btn small class="ml-2" color="error" @click="limpiarDatos()">Limpiar</v-btn>
                            </v-btn-toggle>
                        </v-col>
                    </v-row>

                    <!-- dialogo para crear portabiliada entrada -->
                    <v-dialog v-model="dialogoEntrada" fullscreen persistent>
                        <v-card>
                            <component :is="componenteEntrada" @respuestaComponente="(componenteEntrada = null), (dialogoEntrada = false),
                                listarPortabilidadEntrada()" />
                        </v-card>
                    </v-dialog>

                    <!-- Separador -->
                    <v-divider class="mt-2"></v-divider>

                    <!-- tabla de portabilidad entrada -->
                    <v-data-table :headers="headers" v-if="listaPortabilidadEntrada" :items="listaPortabilidadEntrada"
                        class="elevation-1 mt-4" hide-default-footer disable-pagination
                        no-data-text="Sin datos para mostrar" dense>
                        <template v-slot:[`item.actions`]="{ item }">
                            <td>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn icon v-bind="attrs" v-on="on">
                                            <v-icon color="blue" small class="mr-2" @click="actualizarEntrada(item)">
                                                mdi-eye-arrow-right-outline
                                            </v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Ver Más</span>
                                </v-tooltip>
                            </td>
                            <td>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn icon v-bind="attrs" v-on="on">
                                            <v-icon color="error" small class="mr-2"
                                                @click="inactivarPortabilidadEntrada(item.id)">
                                                mdi-account-key
                                            </v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Inactivar</span>
                                </v-tooltip>
                            </td>
                            <td>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn icon v-bind="attrs" v-on="on">
                                            <v-icon color="success" small class="mr-2"
                                                @click="OrdenesPortabilidadEntrada()">
                                                mdi-book-arrow-down
                                            </v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Ordenes</span>
                                </v-tooltip>
                            </td>
                            <td>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn icon v-bind="attrs" v-on="on">
                                            <v-icon color="blue" small class="mr-2"
                                                @click="OrdenesPortabilidadEntrada()">
                                                mdi-pill
                                            </v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Medicamentos</span>
                                </v-tooltip>
                            </td>
                        </template>
                    </v-data-table>

                    <v-dialog v-model="dialogoPortabilidadEntrada" persistent>
                        <template>
                            <v-card>
                                <v-alert dense text outlined color="blue" border="left"
                                    icon="mdi-arrow-up-bold-circle"><b>Portabilidad
                                        Entrada</b>
                                </v-alert>
                                <v-container>
                                    <v-card-text>
                                        <v-row>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Tipo Documento" dense
                                                    v-model="datosPortabilidadEntrada.tp" outlined readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Numero Documento" dense
                                                    v-model="datosPortabilidadEntrada.numero_documento" readonly
                                                    outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Nombre Completo" dense
                                                    v-model="datosPortabilidadEntrada.nombre_completo" readonly
                                                    outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Sexo" dense v-model="datosPortabilidadEntrada.sexo"
                                                    outlined readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Fecha Nacimiento" dense
                                                    v-model="datosPortabilidadEntrada.fecha_nacimiento" readonly
                                                    outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Fecha Afiliacion" dense
                                                    v-model="datosPortabilidadEntrada.fecha_afiliacion" readonly
                                                    outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Parentesco" dense
                                                    v-model="datosPortabilidadEntrada.parentesco" outlined readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Numero Documento Cotizante" dense
                                                    v-model="datosPortabilidadEntrada.numero_documento_cotizante"
                                                    outlined readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Tipo Cotizante" dense
                                                    v-model="datosPortabilidadEntrada.tipo_cotizante" readonly outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Estado de afiliacion" dense
                                                    v-model="datosPortabilidadEntrada.estado" readonly outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Estado de afiliacion" dense
                                                    v-model="datosPortabilidadEntrada.discapacidad" readonly outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-alert dense text outlined color="blue" border="left"
                                                    icon="mdi-google-maps">
                                                    <b>Datos Geográficos de Afiliación en Hosvital - Fiduprevisora
                                                    </b>
                                                </v-alert>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Departamento Afiliación" dense
                                                    v-model="datosPortabilidadEntrada.departamentoAfiliacion" readonly
                                                    outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Dane Departamento" dense
                                                    v-model="datosPortabilidadEntrada.DaneDepartamento" readonly
                                                    outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Municipio Afiliación" dense
                                                    v-model="datosPortabilidadEntrada.municipioAfiliacion" readonly
                                                    outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Dane Municipio" dense
                                                    v-model="datosPortabilidadEntrada.DaneMunicipio" readonly outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-alert dense text outlined color="blue" border="left"
                                                    icon="mdi-google-maps">
                                                    <b>Datos Geográficos Sedes de Atención en SUMIMEDICAL - RED DE
                                                        PRESTADORES
                                                    </b>
                                                </v-alert>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Subregión" dense
                                                    v-model="datosPortabilidadEntrada.subregion" readonly outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Departamento Atencion" dense
                                                    v-model="datosPortabilidadEntrada.departamentoAtencion" readonly
                                                    outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Municipio Atencion" dense
                                                    v-model="datosPortabilidadEntrada.municipioAtencion" readonly
                                                    outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="IPS Atencion" dense
                                                    v-model="datosPortabilidadEntrada.ips" readonly outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Sede Odontologica" dense
                                                    v-model="datosPortabilidadEntrada.sede_odontologica" readonly
                                                    outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Telefono" dense
                                                    v-model="datosPortabilidadEntrada.telefono" readonly outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Celular 1" dense
                                                    v-model="datosPortabilidadEntrada.celular1" readonly outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Celular 2" dense
                                                    v-model="datosPortabilidadEntrada.celular2" readonly outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Correo 1" dense
                                                    v-model="datosPortabilidadEntrada.correo1" readonly outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Correo 2" dense
                                                    v-model="datosPortabilidadEntrada.correo2" readonly outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Medico Familia 1" dense
                                                    v-model="datosPortabilidadEntrada.medico_familia1" readonly
                                                    outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Medico Familia 2" dense
                                                    v-model="datosPortabilidadEntrada.medico_familia2" readonly
                                                    outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Entidad" dense
                                                    v-model="datosPortabilidadEntrada.entidad" readonly outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-alert dense text outlined color="blue" border="left"
                                                    icon="mdi-book-open-variant-outline">
                                                    <b>Datos Portabilidad
                                                    </b>
                                                </v-alert>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-select label="IPS origen portabilidad" dense :items="ipsPortabilidad"
                                                    v-model="datosPortabilidadEntrada.origen_ips" outlined>
                                                </v-select>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Telefono IPS portabilidad" dense
                                                    v-model="datosPortabilidadEntrada.telefono_ips" outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Correo IPS portabilidad" dense
                                                    v-model="datosPortabilidadEntrada.correo_ips" outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Fecha Inicio Portabilidad" dense
                                                    v-model="datosPortabilidadEntrada.fecha_inicio" type="date"
                                                    outlined>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Cantidad días" dense
                                                    v-model="datosPortabilidadEntrada.cantidad_dias" outlined
                                                    @change="calcularFechaPortabilidadEntrada()">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Fecha Final Portabilidad" dense
                                                    v-model="datosPortabilidadEntrada.fecha_final" type="date" outlined
                                                    disabled>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-alert dense text outlined color="blue" border="left"
                                                    icon="mdi-invoice-text-edit" full-width>
                                                    <b>Novedades Afiliado</b>
                                                </v-alert>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-data-table :headers="novedadesEntradaHeaders"
                                                    :items="novedadesEntrada" hide-default-footer
                                                    no-data-text="Sin datos para mostrar" dense>
                                                </v-data-table>
                                            </v-col>
                                            <v-spacer></v-spacer>
                                        </v-row>
                                        <v-col>
                                            <v-card-actions class="justify-end">
                                                <v-btn small dark color="red"
                                                    @click="dialogoPortabilidadEntrada = false">Cerrar</v-btn>
                                                <v-btn small dark color="warning"
                                                    @click="actualizarPortabilidadEntrada()">Actualizar</v-btn>
                                            </v-card-actions>
                                        </v-col>
                                    </v-card-text>
                                </v-container>
                            </v-card>
                        </template>
                    </v-dialog>

                    <v-dialog v-model="ordenesEntrada">
                        <template>
                            <v-card flat>
                                <v-alert dense text outlined color="success" border="left"
                                    icon="mdi-arrow-up-bold-circle"><b>Ordenes
                                        Portabilidad Entrada</b>
                                </v-alert>

                                <v-card-text>
                                    <v-row>
                                        <v-col md="12">
                                            <v-data-table :headers="Pe_Ordenes" class="elevation-1 mt-4"
                                                hide-default-footer disable-pagination
                                                no-data-text="Sin datos para mostrar" dense>
                                                <template v-slot:[`item.actions`]="{ item }">
                                                    <td>
                                                        <v-tooltip top>
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-btn icon v-bind="attrs" v-on="on">
                                                                    <v-icon color="blue" small class="mr-2">
                                                                        mdi-arrow-down-bold-box
                                                                    </v-icon>
                                                                </v-btn>
                                                            </template>
                                                            <span>Imprimir</span>
                                                        </v-tooltip>
                                                    </td>
                                                    <td>
                                                        <v-tooltip top>
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-btn icon v-bind="attrs" v-on="on">
                                                                    <v-icon color="blue" small class="mr-2">
                                                                        mdi-arrow-down-bold-box
                                                                    </v-icon>
                                                                </v-btn>
                                                            </template>
                                                            <span>Pasar a Auditoria</span>
                                                        </v-tooltip>
                                                    </td>
                                                </template>
                                            </v-data-table>
                                        </v-col>
                                    </v-row>
                                </v-card-text>

                            </v-card>
                        </template>
                    </v-dialog>

                    <!-- Filtrador por pagina -->
                    <v-row no-gutters>
                        <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                            <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                                @input="listarPortabilidadEntrada()"></v-pagination>
                        </v-col>
                        <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                            <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                                @change="listarPortabilidadEntrada()"></v-select>
                        </v-col>
                    </v-row>
                </div>
            </v-card>
        </v-tab-item>

        <!-- Boton para abrir modal para crear una portabilidad de salida -->
        <v-tab-item :value="'tab-2'">
            <v-card class="mx-100">
                <div>
                    <v-toolbar flat>
                        <v-spacer></v-spacer>
                        <v-btn color="success" class="white--text ma-2 px-6" small
                            @click="abrilModalSalida('crear')">Crear<v-icon>
                                mdi-plus</v-icon>
                        </v-btn>
                    </v-toolbar>

                    <v-row class="mx-2">
                        <v-col md="3" lg="3" xl="3" sm="6" cols>
                            <v-text-field dense v-model="filtroSalida.documentoSalida" label="Documento" outlined>
                            </v-text-field>
                        </v-col>

                        <v-col md="3" lg="3" xl="3" sm="6" cols>
                            <v-text-field dense v-model="filtroSalida.nombre_afiliadoSalida" label="Nombre Afiliado"
                                outlined>
                            </v-text-field>
                        </v-col>

                        <v-col md="3" lg="3" xl="3" sm="6" cols>
                            <v-text-field dense v-model="filtroSalida.entidadSalida" label="IPS Portabilidad" outlined>
                            </v-text-field>
                        </v-col>

                        <v-col md="2" lg="2" xl="2" sm="6" cols>
                            <v-btn-toggle background-color="white" dark>
                                <v-btn small color="success" @click="listarPortabilidadSalida()">Filtrar</v-btn>
                                <v-btn small class="ml-2" color="error" @click="limpiarDatosSalida()">Limpiar</v-btn>
                            </v-btn-toggle>
                        </v-col>
                    </v-row>

                    <!-- dialogo para crear portabiliada salida -->
                    <v-dialog v-model="dialogoSalida" fullscreen persistent>
                        <v-card>
                            <component :is="componenteSalida" @respuestaComponente="(componenteSalida = null), (dialogoSalida = false),
                                listarPortabilidadSalida()" />
                        </v-card>
                    </v-dialog>

                    <!-- Separador -->
                    <v-divider class="mt-2"></v-divider>

                    <!-- tabla de portabilidad salida -->
                    <v-data-table :headers="headersSalida" v-if="listaPortabilidadSalida"
                        :items="listaPortabilidadSalida" class="elevation-1 mt-4" hide-default-footer disable-pagination
                        no-data-text="Sin datos para mostrar" dense loading:loading>

                        <template v-slot:[`item.actions`]="{ item }">
                            <td>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn color="blue" icon v-bind="attrs" v-on="on" @click="Salida(item)">
                                            <v-icon small>mdi-eye-arrow-right-outline</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Ver más</span>
                                </v-tooltip>
                            </td>
                            <td>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn icon v-bind="attrs" v-on="on"
                                            @click="inactivarPortabilidadSalida(item.id)">
                                            <v-icon color="error" small class="mr-2">
                                                mdi-account-key
                                            </v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Inactivar</span>
                                </v-tooltip>
                            </td>
                        </template>
                    </v-data-table>

                    <!-- dialogo para actualizar la portabilidad de salida -->
                    <v-dialog v-model="portabilidadSalida" persistent>
                        <template>
                            <v-card>
                                <v-alert dense text outlined color="blue" border="left"
                                    icon="mdi-account-arrow-down"><b>Portabilidad
                                        Salida</b>
                                </v-alert>
                                <v-container>
                                    <v-card-text>
                                        <v-row>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field outlined dense label="Número Documento"
                                                    v-model="datosPortabilidadSalida.numero_documento" readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field dense outlined label="Tipo Documento"
                                                    v-model="datosPortabilidadSalida.documento" readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field dense outlined label="Region"
                                                    v-model="datosPortabilidadSalida.region" readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field dense outlined label="Entidad"
                                                    v-model="datosPortabilidadSalida.entidad" readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field dense outlined label="Primer Nombre"
                                                    v-model="datosPortabilidadSalida.primer_nombre" readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field dense outlined label="Segundo Nombre"
                                                    v-model="datosPortabilidadSalida.segundo_nombre" readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field dense outlined label="Primer Apellido"
                                                    v-model="datosPortabilidadSalida.primer_apellido" readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field dense outlined label="Segundo Apellido"
                                                    v-model="datosPortabilidadSalida.segundo_apellido" readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field dense outlined label="Sexo"
                                                    v-model="datosPortabilidadSalida.sexo" readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field dense outlined label="Ips Primaria"
                                                    v-model="datosPortabilidadSalida.IpsPrimaria" readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field dense outlined label="Fecha de Nacimiento"
                                                    v-model="datosPortabilidadSalida.fecha_nacimiento" readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field dense outlined label="Parentesco"
                                                    v-model="datosPortabilidadSalida.parentesco" readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field dense outlined label="Tipo Doc. Cotizante"
                                                    v-model="datosPortabilidadSalida.tipo_documento_cotizante" readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field dense outlined label="Documento del Cotizante"
                                                    v-model="datosPortabilidadSalida.numero_documento_cotizante"
                                                    readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field dense outlined label="Tipo de Cotizante"
                                                    v-model="datosPortabilidadSalida.tipo_cotizante" readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field dense outlined label="Estado de afiliación"
                                                    v-model="datosPortabilidadSalida.estado_afiliacion" readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field dense outlined label="Grado de discapacidad"
                                                    v-model="datosPortabilidadSalida.discapacidad" readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field dense outlined label="Discapacidad"
                                                    v-model="datosPortabilidadSalida.grado_discapacidad" readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-alert dense text outlined color="blue" border="left"
                                                    icon="mdi-account-arrow-down" full-width>
                                                    <b>Datos Portabilidad</b>
                                                </v-alert>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field outlined dense label="Departamento Receptor"
                                                    v-model="datosPortabilidadSalida.departamento"
                                                    readonly></v-text-field>
                                            </v-col>
                                            <!-- <v-col cols="12" sm="12" md="3">
                        <v-autocomplete dense outlined :items="departamentos" item-text="nombre" item-value="id"
                          label="Departamento Receptor" v-model="datosPortabilidadSalida.departamento">
                        </v-autocomplete>
                      </v-col> -->
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field label="Municipio Receptor"
                                                    v-model="datosPortabilidadSalida.municipio" readonly outlined dense>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-select :items="ut" dense outlined label="Entidad Receptora"
                                                    v-model="datosPortabilidadSalida.destino_ips">
                                                </v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="3">
                                                <v-text-field v-model="datosPortabilidadSalida.fecha_inicio"
                                                    label="Fecha inicial Portabilidad" type="date" outlined
                                                    dense></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="3">
                                                <v-text-field outlined type="number"
                                                    v-model="datosPortabilidadSalida.cantidad" label="Cantidad" dense
                                                    :error-messages="errors.cantidad ? [errors.cantidad] : []"
                                                    @change="calcularFechaFinal"
                                                    hint="La cantidad debe tener un rango entre 15 y 180 días"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-text-field dense outlined label="Fecha final portabilidad"
                                                    v-model="datosPortabilidadSalida.fecha_final" type="date" disabled>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-select dense outlined label="Motivo" :items="motivos"
                                                    v-model="datosPortabilidadSalida.motivo">
                                                </v-select>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-alert dense text outlined color="blue" border="left"
                                                    icon="mdi-invoice-text-edit" full-width>
                                                    <b>Novedades Afiliado</b>
                                                </v-alert>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-data-table :headers="novedadesHeaders" :items="novedades"
                                                    hide-default-footer no-data-text="Sin datos para mostrar" dense>
                                                </v-data-table>
                                            </v-col>
                                            <v-spacer></v-spacer>
                                            <v-col>
                                                <v-card-actions class="justify-end">
                                                    <v-btn small dark color="red"
                                                        @click="limpiarPortabilidadSalida()">Cerrar</v-btn>
                                                    <v-btn small dark color="warning"
                                                        @click="actualizarPortabilidadSalida()">Actualizar</v-btn>
                                                </v-card-actions>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-container>
                            </v-card>
                        </template>
                    </v-dialog>
                    <!-- fin del dialogo -->

                    <!-- Filtrador por pagina -->
                    <v-row no-gutters>
                        <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                            <v-pagination v-model="paginaSalida" class="my-4" :length="totalSalida" :total-visible="9"
                                @input="listarPortabilidadSalida()"></v-pagination>
                        </v-col>
                        <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                            <v-select class="my-4" v-model="opcionActualSalida" :items="opcionesSalida" dense solo small
                                @change="listarPortabilidadSalida()"></v-select>
                        </v-col>
                    </v-row>
                </div>
            </v-card>
        </v-tab-item>

        <v-tab-item :value="'tab-3'">
            <v-card>
                <div>
                    <v-card-text>
                        <v-row class="mx-2">
                            <v-col md="3" lg="3" xl="3" sm="6" cols>
                                <v-text-field dense v-model="filtroHistorico.numero_documento" label="Documento"
                                    outlined>
                                </v-text-field>
                            </v-col>

                            <v-col md="3" lg="3" xl="3" sm="6" cols>
                                <v-text-field dense v-model="filtroHistorico.nombre_completo" label="Nombre Afiliado"
                                    outlined>
                                </v-text-field>
                            </v-col>

                            <v-col md="3" lg="3" xl="3" sm="6" cols>
                                <v-text-field dense v-model="filtroHistorico.fecha_desde" label="Desde" outlined
                                    type="date">
                                </v-text-field>
                            </v-col>

                            <v-col md="3" lg="3" xl="3" sm="6" cols>
                                <v-text-field dense v-model="filtroHistorico.fecha_hasta" label="Hasta" outlined
                                    type="date">
                                </v-text-field>
                            </v-col>

                            <v-col md="2" lg="2" xl="2" sm="6" cols>
                                <v-btn-toggle background-color="white" dark>
                                    <v-btn small color="success"
                                        @click="listarHistoricoPortabilidades()">Filtrar</v-btn>
                                    <v-btn small class="ml-2" color="error"
                                        @click="limpiarDatosHistorico()">Limpiar</v-btn>
                                </v-btn-toggle>
                            </v-col>

                            <v-dialog v-model="HistoricoPortabilidad" persistent>
                                <template>
                                    <v-card>
                                        <v-alert dense text outlined color="blue" border="left"
                                            icon="mdi-account-arrow-down"><b>Historico
                                                Portabilidad</b>
                                        </v-alert>
                                        <v-card-text>
                                            <v-row>
                                                <v-col cols="12" sm="12" md="3">
                                                    <v-text-field label="Tipo Documento"
                                                        v-model="Historico.tipo_documento" outlined dense readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="3">
                                                    <v-text-field label="Documento" v-model="Historico.numero_documento"
                                                        outlined dense readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="3">
                                                    <v-text-field label="Nombre Completo"
                                                        v-model="Historico.nombre_completo" outlined dense readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="3">
                                                    <v-text-field label="Sexo" v-model="Historico.sexo" outlined dense
                                                        readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="3">
                                                    <v-text-field label="Fecha Nacimiento"
                                                        v-model="Historico.fecha_nacimiento" outlined dense readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="3">
                                                    <v-text-field label="Edad Cumplida"
                                                        v-model="Historico.edad_cumplida" outlined dense readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="3">
                                                    <v-text-field label="Estado Afiliacion"
                                                        v-model="Historico.estado_afiliacion" outlined dense readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="3">
                                                    <v-text-field label="Region" v-model="Historico.region" outlined
                                                        dense readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="3">
                                                    <v-text-field label="Entidad" v-model="Historico.entidad" outlined
                                                        dense readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="3">
                                                    <v-text-field label="IPS primaria" v-model="Historico.IpsPrimaria"
                                                        outlined dense readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col md="12">
                                                    <v-alert dense text outlined color="blue" border="left"
                                                        icon="mdi-map-marker-multiple-outline">
                                                        <b>Datos Geográficos de Afiliación en Hosvital - Fiduprevisora
                                                        </b>
                                                    </v-alert>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="3">
                                                    <v-text-field label="Departamento Afiliación" dense
                                                        v-model="Historico.departamentoAfiliacion" readonly outlined>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="3">
                                                    <v-text-field label="Dane Departamento" dense
                                                        v-model="Historico.DaneDepartamento" readonly outlined>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="3">
                                                    <v-text-field label="Municipio Afiliación" dense
                                                        v-model="Historico.municipioAfiliacion" readonly outlined>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="3">
                                                    <v-text-field label="Dane Municipio" dense
                                                        v-model="Historico.DaneMunicipio" readonly outlined>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col md="12">
                                                    <v-alert dense text outlined color="blue" border="left"
                                                        icon="mdi-invoice-text-edit">
                                                        <b>Datos
                                                            Portabilidad-Novedades</b>
                                                    </v-alert>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="3">
                                                    <v-text-field label="Fecha Novedad"
                                                        v-model="Historico.fecha_novedad" outlined dense readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="3">
                                                    <v-text-field label="Tipo Novedad" v-model="Historico.tipo_novedad"
                                                        outlined dense readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="6">
                                                    <v-text-field label="Fecha Inicial Portabilidad"
                                                        v-model="combinedFecha" outlined dense readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="6">
                                                    <v-text-field label="Cantidad días" v-model="cantidadCombined"
                                                        outlined dense readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="6">
                                                    <v-text-field label="Fecha Final Portabilidad" v-model="fechaFinal"
                                                        outlined dense readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="6"
                                                    v-if="Historico.tipo_novedad === 'Portabilidad Entrada'">
                                                    <v-text-field label="IPS de origen" v-model="Historico.origen_ips"
                                                        outlined dense readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="6"
                                                    v-if="Historico.tipo_novedad === 'Portabilidad Entrada'">
                                                    <v-text-field label="Telefono IPS" v-model="Historico.telefono_ips"
                                                        outlined dense readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="6"
                                                    v-if="Historico.tipo_novedad === 'Portabilidad Entrada'">
                                                    <v-text-field label="Correo IPS" v-model="Historico.correo_ips"
                                                        outlined dense readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="6"
                                                    v-if="Historico.tipo_novedad === 'Portabilidad Salida'">
                                                    <v-text-field label="IPS de destino" v-model="Historico.destino_ips"
                                                        outlined dense readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="6"
                                                    v-if="Historico.tipo_novedad === 'Portabilidad Salida'">
                                                    <v-text-field label="Departamento Receptor"
                                                        v-model="Historico.departamentoReceptor" outlined dense
                                                        readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="6"
                                                    v-if="Historico.tipo_novedad === 'Portabilidad Salida'">
                                                    <v-text-field label="Municipio Receptor"
                                                        v-model="Historico.municipioReceptor" outlined dense readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="6">
                                                    <v-text-field label="Motivo Novedad" v-model="Historico.motivo"
                                                        outlined dense readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="3">
                                                    <v-text-field label="Usuario que realizó la novedad"
                                                        v-model="Historico.nombre_empleado" outlined dense readonly>
                                                    </v-text-field>
                                                </v-col>

                                                <v-spacer></v-spacer>
                                                <v-col>
                                                    <v-card-actions class="justify-end">
                                                        <v-btn small dark color="red"
                                                            @click="HistoricoPortabilidad = false">Cerrar</v-btn>

                                                    </v-card-actions>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </template>
                            </v-dialog>

                            <v-col md="12">
                                <v-data-table :headers="headerHistorico" :items="historicoPortabilidades"
                                    class="elevation-1 mt-4" hide-default-footer disable-pagination
                                    no-data-text="Sin datos para mostrar" dense>
                                    <template v-slot:[`item.actions`]="{ item }">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn icon v-bind="attrs" v-on="on">
                                                    <v-icon color="blue" small class="mr-2"
                                                        @click="PortabilidadHistorico(item)">
                                                        mdi-eye-arrow-right-outline
                                                    </v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Ver Más</span>
                                        </v-tooltip>
                                    </template>
                                </v-data-table>
                            </v-col>

                            <v-row no-gutters>
                                <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                                    <v-pagination v-model="paginaHistorico" class="my-4" :length="totalHistorico"
                                        :total-visible="9" @input="listarHistoricoPortabilidades"></v-pagination>
                                </v-col>
                                <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                                    <v-select class="my-4" v-model="opcionActualHistorico" :items="opcionesHistorico"
                                        dense solo small @change="listarHistoricoPortabilidades"></v-select>
                                </v-col>
                            </v-row>
                        </v-row>
                    </v-card-text>
                </div>
            </v-card>
        </v-tab-item>
    </v-tabs>
</template>

<script>
import AfiliadoComponent from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import formPacienteSalida from "@/components/aseguramiento/portabilidad/FormPortabilidadSalidaComponent.vue";
import formPacienteEntrada from "@/components/aseguramiento/portabilidad/FormPortabilidadEntradaComponent.vue";
import formPacienteHistorico from "@/components/aseguramiento/portabilidad/FormPortabilidadHistoricoComponent.vue";
import {
    listarPortabilidadEntrada
} from "~/api/aseguramiento/portabilidadEntrada";
export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can("asegurador.menu.portabilidad")) {
            return redirect("/");
        }
    },

    name: "Portabilidad",
    components: {
        AfiliadoComponent,
        formPacienteSalida,
        formPacienteHistorico,
        formPacienteEntrada
    },
    data() {
        return {
            rules: {
                cantidad: [
                    value => !!value || 'Cantidad es requerida',
                    value => (value >= 15 && value <= 180) || 'La cantidad debe tener un rango entre 15 y 180 días',
                ],
            },
            datos: {},
            preload: false,
            loading: false,
            dialogoEntrada: false,
            dialogoSalida: false,
            dialogoPortabilidadEntrada: false,
            HistoricoPortabilidad: false,
            portabilidadSalida: false,
            ordenesEntrada: false,
            dialogHistorico: false,
            departamentos: [],
            municipios: [],
            municipio: [],
            novedades: [],
            novedadesEntrada: [],
            historicoPortabilidades: [],
            editar: false,
            total: 0,
            pagina: 1,
            opciones: [5, 10, 20, 50, 100],
            opcionActual: 5,

            totalSalida: 0,
            paginaSalida: 1,
            opcionesSalida: [5, 10, 20, 50, 100],
            opcionActualSalida: 5,

            totalHistorico: 0,
            paginaHistorico: 1,
            opcionesHistorico: [5, 10, 20, 50, 100],
            opcionActualHistorico: 5,

            filtro: {
                documento: '',
                nombre_afiliado: '',
                entidad: ''
            },

            filtroHistorico: {
                numero_documento: '',
                nombre_completo: '',
                fecha_desde: '',
                fecha_hasta: ''
            },


            filtroSalida: {
                documentoSalida: '',
                nombre_afiliadoSalida: '',
                entidadSalida: ''
            },
            ut: [
                "UNION TEMPORAL TOLIHUILA",
                "COSMITET LTDA CORPORACION DE SERVICIOS MEDICOS INTERNANCIONALES THEM Y CIA LTDA",
                "UNION TEMPORAL SALUDSUR2",
                "MEDISALUD UT",
                "UNION TEMPORAL DEL NORTE REGION CINCO",
                "ORGANIZACIÓN CLINICA GENERAL DEL NORTE S.A.",
                "UT RED INTEGRADA FOSCAL - CUB",
                "REDVITAL UT",
                "UNIÓN TEMPORAL SERVISALUD SAN JOSÉ",
            ],
            ipsPortabilidad: [
                "UNION TEMPORAL TOLIHUILA",
                "COSMITET LTDA CORPORACION DE SERVICIOS MEDICOS INTERNANCIONALES THEM Y CIA LTDA",
                "UNION TEMPORAL SALUDSUR2",
                "MEDISALUD UT",
                "UNION TEMPORAL DEL NORTE REGION CINCO",
                "ORGANIZACIÓN CLINICA GENERAL DEL NORTE S.A.",
                "UT RED INTEGRADA FOSCAL - CUB",
                "REDVITAL UT",
                "COSMITET LTDA. CORPORACION DE SERVICIOS MEDICOS INTERNACIONALES THEM Y CIA LTDA",
                "UNIÓN TEMPORAL SERVISALUD SAN JOSÉ"
            ],
            datosAfiliados: null,
            datosAfiliadosSalida: null,
            componente: null,
            componenteSalida: null,
            componenteEntrada: null,
            componenteHistorico: null,
            buscarPortabilidad: "",
            listaPortabilidadEntrada: [],
            listaPortabilidadSalida: [],
            datosPortabilidadEntrada: {
                id: '',
                numero_documento: '',
                tp: '',
                nombre_completo: '',
                sexo: '',
                fecha_nacimiento: '',
                fecha_afiliacion: '',
                parentesco: '',
                numero_documento_cotizante: '',
                tipo_cotizante: '',
                estado: '',
                discapacidad: '',
                departamentoAfiliacion: '',
                DaneDepartamento: '',
                municipioAfiliacion: '',
                DaneMunicipio: '',
                subregion: '',
                departamentoAtencion: '',
                municipioAtencion: '',
                ips: '',
                sede_odontologica: '',
                telefono: '',
                celular1: '',
                celular2: '',
                correo1: '',
                correo2: '',
                medico_familia1: '',
                medico_familia2: '',
                entidad: '',
                origen_ips: '',
                telefono_ips: '',
                correo_ips: '',
                fecha_inicio: '',
                fecha_final: '',
                cantidad_dias: ''
            },
            datosPortabilidadSalida: {
                id: '',
                numero_documento: '',
                documento: '',
                region: '',
                entidad: '',
                primer_nombre: '',
                segundo_nombre: '',
                primer_apellido: '',
                segundo_apellido: '',
                sexo: '',
                IpsPrimaria: '',
                fecha_nacimiento: '',
                parentesco: '',
                tipo_documento_cotizante: '',
                numero_documento_cotizante: '',
                estado_afiliacion: '',
                discapacidad: '',
                grado_discapacidad: '',
                departamento: '',
                municipio: '',
                destino_ips: '',
                fecha_inicio: '',
                fecha_final: '',
                motivo: '',
                cantidad: '',
                afiliado_id: ''
            },
            Historico: {
                numero_documento: '',
                tipo_documento: '',
                nombre_completo: '',
                fecha_novedad: '',
                tipo_novedad: '',
                motivo: '',
                nombre_empleado: '',
                sexo: '',
                edad_cumplida: '',
                fecha_pe: '',
                fecha_ps: '',
                fecha_nacimiento: '',
                estado_afiliacion: '',
                region: '',
                entidad: '',
                IpsPrimaria: '',
                cantidad: '',
                cantidad_dias: '',
                fecha_final_pe: '',
                fecha_final_ps: '',
                origen_ips: '',
                destino_ips: '',
                telefono_ips: '',
                correo_ips: '',
                departamentoReceptor: '',
                municipioReceptor: ''
            },
            reps: [],
            errors: {
                tipo_documento: "",
                documento: "",
                primer_nombre: "",
                segundo_nombre: "",
                primer_apellido: "",
                segundo_apellido: "",
                region: "",
                ut: "",
                sexo: "",
                fecha_nacimiento: "",
                fecha_afiliacion: "",
                tipo_afiliacion: "",
                departamento_afiliacion: "",
                dane_departamento: "",
                municipio_afiliacion: "",
                dane_municipio: "",
                subregion: "",
                departamento_atencion: "",
                municipio_atencion: "",
                ips: "",
                sede_odontologica: "",
                Direccion_Residencia: "",
                Mpio_Residencia: "",
                Celular1: "",
                Correo1: "",
                entidad_id: "",
                ipsorigen_portabilidad: "",
                telefonoorigen_portabilidad: "",
                correoorigen_portabilidad: "",
                fechaInicio_portabilidad: "",
                fechaFinal_portabilidad: "",
                tipo_cotizante: '',
                cantidad: '',
            },
            paginate: {
                total: 0,
                page: 1,
            },
            Pe_Ordenes: [{
                text: 'Orden'
            },
            {
                text: 'Codigo'
            },
            {
                text: 'Servicio/Medicamento'
            },
            {
                text: 'Fecha Orden'
            },
            {
                text: 'Imprimir'
            },
            {
                text: 'Acciones',
                value: 'actions'
            }

            ],
            novedadesHeaders: [{
                text: "Fecha Novedad",
                align: "start",
                sortable: false,
                value: "fecha_novedad",
            },
            {
                text: "Motivo",
                align: "start",
                sortable: false,
                value: "Motivo",
            },
            {
                text: "Usuario",
                align: "start",
                sortable: false,
                value: "nombre_completo",
            }
            ],
            headerHistorico: [{
                text: 'Id',
                value: 'id'
            },
            {
                text: 'Tipo Documento',
                value: 'tipo_documento'
            },
            {
                text: 'Documento',
                value: 'numero_documento'
            },
            {
                text: 'Nombre Afiliado',
                value: 'nombre_completo'
            },
            {
                text: 'Fecha novedad',
                value: 'fecha_novedad'
            },
            {
                text: 'Tipo Novedad',
                value: 'tipo_novedad.nombre'
            },
            {
                text: 'Acciones',
                value: 'actions'
            }
            ],
            novedadesEntradaHeaders: [{
                text: "Fecha Novedad",
                align: "start",
                sortable: false,
                value: "fecha_novedad",
            },
            {
                text: "Motivo",
                align: "start",
                sortable: false,
                value: "Motivo",
            },
            {
                text: "Usuario",
                align: "start",
                sortable: false,
                value: "nombre_completo",
            }
            ],
            headers: [{
                text: "Id",
                align: "start",
                sortable: false,
                value: "id",
            },
            {
                text: "Tipo Documento",
                value: "tp",
            },
            {
                text: "Documento",
                value: "numero_documento",
            },
            {
                text: "Afiliado",
                value: "nombre_completo",
            },
            {
                text: "Entidad",
                value: "entidad",
            },
            {
                text: "Fecha Inicial portabilidad",
                value: "fecha_inicio",
            },
            {
                text: "Fecha Final portabilidad",
                value: "fecha_final",
            },
            {
                text: "IPS Portabilidad",
                value: "origen_ips",
            },
            {
                text: "Acciones",
                value: "actions",
                sortable: false,
            },
            ],

            headersSalida: [{
                text: "id",
                align: "start",
                sortable: false,
                value: "id",
            },
            {
                text: "Tipo Documento",
                value: "documento",
            },
            {
                text: "Documento",
                value: "numero_documento",
            },
            {
                text: "Afiliado",
                value: "nombre_completo",
            },
            {
                text: "Entidad",
                value: "entidad",
            },
            {
                text: "Fecha Inicial",
                value: "fecha_inicio",
            },
            {
                text: "Fecha Final",
                value: "fecha_final",
            },
            {
                text: "Departamento",
                value: "departamento",
                sortable: false,
            },
            {
                text: "Municipio",
                value: "municipio",
                sortable: false,
            },
            {
                text: "IPS Portabilidad",
                value: "destino_ips",
            },
            {
                text: "Acciones",
                value: "actions",
                sortable: false,
            },
            ],

            regiones: [
                "Región 1",
                "Región 2",
                "Región 3",
                "Región 4",
                "Región 5",
                "Región 6",
                "Región 7",
                "Región 8",
                "Región 9",
                "Región 10",
            ],
            ut: [
                "UNION TEMPORAL TOLIHUILA",
                "COSMITET LTDA CORPORACION DE SERVICIOS MEDICOS INTERNANCIONALES THEM Y CIA LTDA",
                "UNION TEMPORAL SALUDSUR2",
                "MEDISALUD UT",
                "UNION TEMPORAL DEL NORTE REGION CINCO",
                "ORGANIZACIÓN CLINICA GENERAL DEL NORTE S.A.",
                "UT RED INTEGRADA FOSCAL - CUB",
                "REDVITAL UT",
                "COSMITET LTDA. CORPORACION DE SERVICIOS MEDICOS INTERNACIONALES THEM Y CIA LTDA",
                "UNIÓN TEMPORAL SERVISALUD SAN JOSÉ",
            ],
            tipoDocumento: ["RC", "TI", "CC", "CE", "PA", "CN", "PE", "SA"],
            sexo: ["M", "F"],
            parentesco: [
                "Padre o Madre",
                "Hijo Docente",
                "NO APLICA",
                "Conyuge o Compañero",
                "Hijo Conyuge",
                "Hijo Adoptivo",
                "Hijo Discapacitado",
                "Otro",
                "Nieto menor o igual a 30 días",
            ],
            TipoCotizante: [
                "Cotizante docente",
                "Cotizante Fallecido",
                "Cotizante Pensionado",
                "Beneficiario",
                "Sustituto Pensional",
            ],
            TipoAfiliado: [
                "BENEFICIARIO",
                "COTIZANTE",
                "Cotizante Fallecido",
                "Sustituto Pensional",
                "Cotizante Pensionado",
                "Cotizante Dependiente",
            ],
            estados: [],
            discapacidad: [
                "Sin discapacidad",
                "Mental/psíquica",
                "Física",
                "Auditiva",
                "Visual",
                "Sordo - Ceguera",
            ],
            subregion: [
                "Nordeste",
                "Suroeste",
                "Occidente",
                "Valle de Aburra",
                "Magdalena Medio",
                "Norte",
                "Oriente",
                "Urabá",
                "Bajo Cauca",
                "PuertosNacionales",
                "PtosSantander",
                "PtosAntioquia",
                "Santanderes",
                "Antioquia",
            ],
            gradoDiscapacidad: ["Moderada", "Leve", "Severa"],
            sedeOdontologia: [
                "SUMIMEDICAL QUIBDO",
                "SUMIMEDICAL S.A.S SEDE APARTADO",
                "SUMIMEDICAL S.A.S SEDE BELLO",
                "SUMIMEDICAL S.A.S SEDE CAUCASIA",
                "SUMIMEDICAL S.A.S SEDE COPACABANA",
                "SUMIMEDICAL S.A.S SEDE ENVIGADO",
                "SUMIMEDICAL S.A.S SEDE ESTADIO",
                "SUMIMEDICAL S.A.S SEDE ITAGUI",
                "SUMIMEDICAL S.A.S SEDE PUERTO BERRIO",
                "SUMIMEDICAL S.A.S SEDE RIONEGRO",
                "SUMIMEDICAL S.A.S SEDE TURBO",
                "SUMIMEDICAL S.A.S SEDE VILLANUEVA",
                "SUMIMEDICAL SEDE BOLIVIA",
                "SUMIMEDICAL SEDE CALDAS",
                "SUMIMEDICAL SEDE CHIGORODO",
                "NO APLICA",
            ],
            motivos: ['Comisión de Estudios', 'Vacaciones', 'Licencia de Maternidad', 'Razones Familiares', 'Otro'],
            Portabilidad: [{
                text: "SI",
                value: 1,
            },
            {
                text: "NO",
                value: 2,
            },
            ],
            entidades: [],
            departamentoCodigo: [],
            portabilidad: [{
                primer_nombre: "",
                segundo_nombre: "",
                primer_apellido: "",
                segundo_apellido: "",
                region: "",
                ut: "",
                tipo_documento: "",
                numero_documento: "",
                sexo: "",
                fecha_nacimiento: "",
                edad_cumplida: "",
                fecha_afiliacion: "",
                tipo_afiliacion: "",
                orden_judicial: "",
                numero_folio: "",
                fecha_emision: "",
                parentesco: "",
                tipo_documento_cotizante: "",
                numero_documento_cotizante: "",
                tipo_cotizante: "",
                estado_afiliacion: "",
                dane_municipio: "",
                municipio_afiliacion: "",
                dane_departamento: "",
                departamento_afiliacion: "",
                subregion: "",
                departamento_atencion: "",
                municipio_atencion: "",
                ips: "",
                sede_odontologica: "",
                discapacidad: "",
                grado_discapacidad: "",
                email: "",
                password: "",
            },],
        };
    },

    computed: {
        combinedFecha() {
            return this.Historico.fecha_pe || this.Historico.fecha_ps;
        },
        cantidadCombined() {
            return this.Historico.cantidad || this.Historico.cantidad_dias;
        },
        fechaFinal() {
            return this.Historico.fecha_final_pe || this.Historico.fecha_final_ps;
        },
    },

    created() {
        this.listarPortabilidadEntrada();
        this.listarPortabilidadSalida();
        this.listarDepartamentos();
        this.listarNovedades();
        this.listarNovedadesEntrada();
        this.listarHistoricoPortabilidades()
    },

    methods: {
        /**
         * cerrar modal
         * @author kobatime
         */
        cerrar() {
            this.dialogoEntrada = false;
            this.limpiarDatos();
            this.limpiarError();
        },

        abrilModalEntrada(tipo) {
            if (tipo == "crear") {
                this.dialogoEntrada = true;
                this.componenteEntrada = "formPacienteEntrada";
            } else {
                this.dialogoEntrada = true;
                this.componenteEntrada = "formPacienteEntrada";
            }
        },
        abrirModalHistorico(tipo) {
            if (tipo == "crear") {
                this.dialogHistorico = true;
                this.componenteHistorico = "formPacienteHistorico";
            } else {
                this.dialogHistorico = true;
                this.componenteHistorico = "formPacienteHistorico";
            }
        },
        abrilModalSalida(tipo) {
            if (tipo == "crear") {
                this.dialogoSalida = true;
                this.componenteSalida = "formPacienteSalida";
            } else {
                this.dialogoSalida = true;
                this.componenteSalida = "formPacienteSalida";
            }
        },

        listarPortabilidadEntrada() {
            this.preload = true;
            this.$axios.post("/portabilidad-entrada/listarPortabilidad?page=" + this.pagina + "&cant=" + this.opcionActual,
                this.filtro)
                .then(res => {
                    this.listaPortabilidadEntrada = res.data.data;
                    this.total = res.data.last_page;
                    this.preload = false;
                }).catch(error => {
                    this.preload = false;
                    console.log(error);
                });
        },

        // listarPortabilidadEntrada()
        // {
        //   this.preload = true;
        //   this.$axios.post('/portabilidad-entrada/listarPortabilidad').then(res => {
        //     this.listaPortabilidadEntrada = res.data
        //     this.preload = false;
        //   }).catch(error => {
        //     console.log(error);
        //   })
        // },

        listarPortabilidadSalida() {
            this.loading = true;
            this.preload = true;
            this.$axios.post("/portabilidad-salida/listar?page=" + this.paginaSalida + "&cant=" + this.opcionActualSalida,
                this.filtroSalida).then(res => {
                    this.listaPortabilidadSalida = res.data.data.data;
                    this.totalSalida = res.data.data.last_page;
                    this.loading = false;
                    this.preload = false;
                }).catch(error => {
                    this.preload = false;
                    console.log(error);
                });
        },

        listarHistoricoPortabilidades() {
            this.preload = true;
            const params = {
                page: this.paginaHistorico,
                cant: this.opcionActualHistorico,
            };
            if (this.filtroHistorico.numero_documento) {
                params.numero_documento = this.filtroHistorico.numero_documento;
            }

            if (this.filtroHistorico.nombre_completo) {
                params.nombre_completo = this.filtroHistorico.nombre_completo;
            }

            if (this.filtroHistorico.fecha_desde) {
                params.fecha_desde = this.filtroHistorico.fecha_desde;
            }

            if (this.filtroHistorico.fecha_hasta) {
                params.fecha_hasta = this.filtroHistorico.fecha_hasta;
            }

            this.$axios.get("/portabilidad-historico/portabilidadHistorico", {
                params
            })
                .then(res => {
                    this.historicoPortabilidades = res.data.data;
                    this.totalHistorico = res.data.last_page;
                    this.preload = false;
                })
                .catch(err => {
                    this.preload = false;
                    console.error(err);
                });
        },


        /**
         * for de limpiar datos
         * @param portabilidad array
         * @return portabilidad objetos
         * @author kobatime
         */

        limpiarDatos() {
            this.datosAfiliados = null
            for (const key in this.filtro) {
                this.filtro[key] = '';
            }
        },

        limpiarDatosSalida() {
            this.datosAfiliadosSalida = null
            for (const key in this.filtroSalida) {
                this.filtroSalida[key] = '';
            }
        },
        limpiarDatosHistorico() {
            this.filtroHistorico = {
                numero_documento: '',
                nombre_completo: '',
                fecha_novedad: ''
            }
            this.listarHistoricoPortabilidades()
        },

        /**
         * for de limpiar errores
         * @param errors array
         * @return errors objetos
         * @author kobatime
         */
        limpiarError() {
            for (const key in this.errors) {
                this.errors[key] = "";
            }
        },

        /**
         * concultar reps segun municipio
         * @param municipio_id int
         * @return reps objetos
         * @author kobatime
         */
        getReps(id) {
            const requets = {
                municipio_id: id,
            };
            this.$axios
                .post("/reps/listar", requets)
                .then((res) => {
                    this.reps = res.data;
                })
                .catch((error) => {
                    this.$toast.error("No se ha podido cargar los datos");
                    console.log(error.response);
                });
        },
        listarDepartamentos() {
            this.$axios.get('/departamento/').then(res => {
                this.departamentos = res.data
            }).catch(error => {
                console.log(error)
            })
        },
        listarMunicipios(departamentoId) {
            const departamento = this.departamentos.find(dep => dep.id === departamentoId);
            if (departamento) {
                this.municipios = departamento.municipios.map(municipio => municipio.nombre);
            } else {
                this.municipios = [];
            }
        },
        calcularFechaFinal() {
            if (this.datosPortabilidadSalida.fecha_inicio && this.datosPortabilidadSalida.cantidad) {
                const fechaInicio = new Date(this.datosPortabilidadSalida.fecha_inicio);
                const cantidadDias = parseInt(this.datosPortabilidadSalida.cantidad);
                const fechaFinal = new Date(fechaInicio.getTime() + cantidadDias * 24 * 60 * 60 * 1000);
                this.datosPortabilidadSalida.fecha_final = fechaFinal.toISOString().slice(0, 10);
            }
        },

        calcularFechaPortabilidadEntrada() {
            if (this.datosPortabilidadEntrada.fecha_inicio && this.datosPortabilidadEntrada.cantidad_dias) {
                const fechaInicio = new Date(this.datosPortabilidadEntrada.fecha_inicio);
                const cantidadDias = parseInt(this.datosPortabilidadEntrada.cantidad_dias);
                const fechaFinal = new Date(fechaInicio.getTime() + cantidadDias * 24 * 60 * 60 * 1000);
                this.datosPortabilidadEntrada.fecha_final = fechaFinal.toISOString().slice(0, 10);
            }
        },

        Error(errors) {
            for (const key in this.errors) {
                if (key in errors) {
                    this.errors[key] = errors[key][0];
                }
            }
        },

        actualizarPortabilidadSalida() {
            if (!(this.datosPortabilidadSalida.cantidad >= 15 && this.datosPortabilidadSalida.cantidad <= 180)) {
                this.errors.cantidad = 'La cantidad debe ser un número entre 15 y 180';
                return;
            }
            this.errors.cantidad = '';
            this.$axios.put(`/portabilidad-salida/actualizar/${this.datosPortabilidadSalida.id}`, this
                .datosPortabilidadSalida)
                .then(response => {
                    this.$toast.success('Portabilidad actualizada con éxito');
                    this.portabilidadSalida = false;
                    this.listarPortabilidadSalida();
                })
                .catch(error => {
                    console.error("Error al actualizar la portabilidad de salida:", error);
                });
        },

        actualizarPortabilidadEntrada() {
            if (!(this.datosPortabilidadEntrada.cantidad_dias >= 15 && this.datosPortabilidadEntrada.cantidad_dias <=
                180)) {
                this.errors.cantidad_dias = 'La cantidad debe ser un número entre 15 y 180';
                return;
            }
            this.$axios.put(`/portabilidad-entrada/actualizar/${this.datosPortabilidadEntrada.id}`, this
                .datosPortabilidadEntrada)
                .then(response => {
                    this.$toast.success('Portabilidad actualizada con éxito');
                    this.dialogoPortabilidadEntrada = false;
                    this.listarPortabilidadEntrada();
                })
                .catch(error => {
                    console.error("Error al actualizar la portabilidad de entradad:", error);
                });
        },

        limpiarPortabilidadSalida() {
            this.portabilidadSalida = false,
                this.errors = {
                    cantidad: ''
                }
        },

        inactivarPortabilidadSalida(id) {
            this.$swal({
                title: "¡Atención!",
                text: "¿Está seguro de inactivar esta portabilidad de salida?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#4CAF50",
                cancelButtonColor: "#d33",
                confirmButtonText: "Terminar Portabilidad",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.value) {
                    this.$axios.post(`/portabilidad-salida/inactivar/${id}`)
                        .then(response => {
                            this.$toast.success('Portabilidad inactivada con éxito');
                            this.listarPortabilidadSalida();
                        })
                        .catch(error => {
                            this.$toast.error('No se ha podido inactivar la portabilidad de salida')
                            console.error('Error al inactivar la portabilidad:', error);
                        });
                }
            });
        },
        inactivarPortabilidadEntrada(id) {
            this.$swal({
                title: "¡Atención!",
                text: "¿Está seguro de inactivar esta portabilidad de entrada?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#4CAF50",
                cancelButtonColor: "#d33",
                confirmButtonText: "Terminar Portabilidad",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.value) {
                    this.$axios.post(`/portabilidad-entrada/inactivar/${id}`)
                        .then(response => {
                            this.$toast.success('Portabilidad de entrada inactivada con éxito');
                            this.listarPortabilidadEntrada();
                        })
                        .catch(error => {
                            this.$toast.error('No se ha podido inactivar la portabilidad de entrada')
                            console.error('Error al inactivar la portabilidad:', error);
                        });
                }
            });
        },

        OrdenesPortabilidadEntrada() {
            this.ordenesEntrada = true;
        },

        PortabilidadHistorico() {
            this.HistoricoPortabilidad = true;
        },


        listarNovedades(afiliadoId, portabilidadSalidaid) {
            this.$axios.get(`/portabilidad-salida/listarNovedades/${afiliadoId}/${portabilidadSalidaid}`).then(
                res => {
                    this.novedades = res.data
                }
            ).catch(err => {
                console.log(err)
            })
        },

        listarNovedadesEntrada(afiliadoId, portabilidadEntradaId) {
            this.preload = true;
            this.$axios.get(`/portabilidad-entrada/listarNovedadesEntrada/${afiliadoId}/${portabilidadEntradaId}`).then(
                res => {
                    this.novedadesEntrada = res.data
                    this.preload = false
                }
            ).catch(err => {
                this.preload = false;
                console.log(err)
            })
        },

        PortabilidadHistorico(item) {
            this.HistoricoPortabilidad = true;
            this.Historico = {
                numero_documento: item.numero_documento,
                tipo_documento: item.tipo_documento,
                nombre_completo: item.nombre_completo,
                fecha_novedad: item.fecha_novedad,
                tipo_novedad: item.tipo_novedad.nombre,
                motivo: item.motivo,
                nombre_empleado: item.nombre_empleado,
                sexo: item.sexo,
                edad_cumplida: item.edad_cumplida,
                fecha_pe: item.fecha_pe,
                fecha_ps: item.fecha_ps,
                fecha_nacimiento: item.fecha_nacimiento,
                estado_afiliacion: item.estado_afiliacion,
                region: item.region,
                entidad: item.entidad,
                IpsPrimaria: item.IpsPrimaria,
                cantidad: item.cantidad,
                cantidad_dias: item.cantidad_dias,
                fecha_final_pe: item.fecha_final_pe,
                fecha_final_ps: item.fecha_final_ps,
                departamentoAfiliacion: item.departamentoAfiliacion,
                DaneDepartamento: item.DaneDepartamento,
                municipioAfiliacion: item.municipioAfiliacion,
                DaneMunicipio: item.DaneMunicipio,
                origen_ips: item.origen_ips,
                destino_ips: item.destino_ips,
                telefono_ips: item.telefono_ips,
                correo_ips: item.correo_ips,
                departamentoReceptor: item.departamentoReceptor,
                municipioReceptor: item.municipioReceptor,

            }
        },

        actualizarEntrada(item) {
            this.dialogoPortabilidadEntrada = true;
            const afiliadoId = parseInt(item.afiliado_id);
            const portabilidadEntradaId = parseInt(item.id);
            this.datosPortabilidadEntrada = {
                id: portabilidadEntradaId,
                numero_documento: item.numero_documento,
                tp: item.tp,
                nombre_completo: item.nombre_completo,
                sexo: item.sexo,
                fecha_nacimiento: item.fecha_nacimiento,
                fecha_afiliacion: item.fecha_afiliacion,
                parentesco: item.parentesco,
                numero_documento_cotizante: item.numero_documento_cotizante,
                tipo_cotizante: item.tipo_cotizante,
                estado: item.estado,
                discapacidad: item.discapacidad,
                departamentoAfiliacion: item.departamentoAfiliacion,
                DaneDepartamento: item.DaneDepartamento,
                municipioAfiliacion: item.municipioAfiliacion,
                DaneMunicipio: item.DaneMunicipio,
                subregion: item.subregion,
                departamentoAtencion: item.departamentoAtencion,
                municipioAtencion: item.municipioAtencion,
                ips: item.ips,
                sede_odontologica: item.sede_odontologica,
                telefono: item.telefono,
                celular1: item.celular1,
                celular2: item.celular2,
                correo1: item.correo1,
                correo2: item.correo2,
                medico_familia1: item.medico_familia1,
                medico_familia2: item.medico_familia2,
                entidad: item.entidad,
                origen_ips: item.origen_ips,
                telefono_ips: item.telefono_ips,
                correo_ips: item.correo_ips,
                fecha_inicio: item.fecha_inicio,
                fecha_final: item.fecha_final,
                cantidad_dias: item.cantidad_dias,
                afiliado_id: afiliadoId
            }
            this.listarNovedadesEntrada(afiliadoId, portabilidadEntradaId);
        },

        Salida(item) {
            const afiliadoId = parseInt(item.afiliado_id);
            const portabilidadSalidaid = parseInt(item.id);
            this.portabilidadSalida = true;
            this.datosPortabilidadSalida = {
                numero_documento: item.numero_documento,
                documento: item.documento,
                region: item.region,
                entidad: item.entidad,
                primer_nombre: item.primer_nombre,
                segundo_nombre: item.segundo_nombre,
                primer_apellido: item.primer_apellido,
                segundo_apellido: item.segundo_apellido,
                sexo: item.sexo,
                IpsPrimaria: item.IpsPrimaria,
                fecha_nacimiento: item.fecha_nacimiento,
                parentesco: item.parentesco,
                tipo_documento_cotizante: item.tipo_documento_cotizante,
                numero_documento_cotizante: item.numero_documento_cotizante,
                tipo_cotizante: item.tipo_cotizante,
                estado_afiliacion: item.estado_afiliacion,
                discapacidad: item.discapacidad,
                grado_discapacidad: item.grado_discapacidad,
                departamento: item.departamento,
                municipio: item.municipio,
                destino_ips: item.destino_ips,
                fecha_inicio: item.fecha_inicio,
                fecha_final: item.fecha_final,
                motivo: item.motivo,
                cantidad: item.cantidad,
                id: portabilidadSalidaid,
                afiliado_id: afiliadoId
            };
            this.listarNovedades(afiliadoId, portabilidadSalidaid);
        }



    },
};

</script>
