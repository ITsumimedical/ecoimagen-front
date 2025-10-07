<template>
    <div>
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Gestión Mesa de Ayuda</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
            <v-col>
                <v-row class="mx-2">
                    <v-col md="3" lg="3" xl="3" sm="3s" cols>
                        <v-text-field dense v-model="radicado_filtro" label="Radicado" outlined></v-text-field>
                    </v-col>
                    <v-col md="3" lg="3" xl="3" sm="3s" cols>
                        <v-autocomplete dense v-model="sede_filtro" label="Sedes" outlined
                            :items="sedes"></v-autocomplete>
                    </v-col>
                    <v-col md="2" lg="2" xl="2" sm="2" cols>
                        <v-btn-toggle background-color="white" dark>
                            <v-btn small color="success" @click="ListarCasosMesaAyuda()">Filtrar</v-btn>
                            <v-btn small class="ml-2" color="error" @click="limpiarFiltro()">Limpiar</v-btn>
                        </v-btn-toggle>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <v-col col="12" md="12" sm="12">
                            <v-text-field label="Buscar" v-model="buscar"></v-text-field>
                        </v-col>
                        <v-data-table :search="buscar" :headers="headers" :items="casos" disable-pagination
                            loading-text="Cargando..." hide-default-footer dense
                            no-data-text="No hay datos para mostrar">
                            <template v-slot:[`item.nombrePrioridad`]="{ item }">
                                <v-chip small :color="colorPrioridad(item.nombrePrioridad)" dark>{{ item.nombrePrioridad
                                }}</v-chip>
                            </template>
                            <template v-slot:[`item.actions`]="{ item }">
                                <td>
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn v-bind="attrs" v-on="on" @click="Pendientes(item)" color="blue" icon
                                                small>
                                                <v-icon>mdi-eye</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Ver detalles del caso</span>
                                    </v-tooltip>
                                </td>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>

                <v-dialog v-model="dialogoPendientes" persistent max-width="1500px" scrollable>
                    <v-card elevation="2" class="pa-4">
                        <v-card-title class="d-flex justify-space-between align-center text-h6">
                            <div class="d-flex align-center">
                                <v-icon left class="mr-2">mdi-comment-eye-outline</v-icon>
                                Detalle de Solicitud
                            </div>

                            <v-btn color="primary" small outlined @click="dialogFechaMeta = true">
                                <v-icon left small>mdi-calendar-plus</v-icon>
                                {{ fechaMeta ? 'Actualizar fecha meta' : 'Agregar fecha meta' }}
                            </v-btn>
                        </v-card-title>

                        <div v-if="fechaMetaActual" class="ml-10 mb-3 text-body-2">
                            <v-icon color="blue darken-2" small class="mr-1">mdi-calendar</v-icon>
                            <strong>Fecha meta actual:</strong>
                            {{ formatFecha(fechaMetaActual) }}
                        </div>

                        <!-- Dialogo para agregar/actualizar -->
                        <v-dialog v-model="dialogFechaMeta" max-width="500" persistent>
                            <v-card>
                                <v-alert text dense border="left" color="info" icon="mdi-calendar">
                                    <b>{{ fechaMeta ? 'Actualizar' : 'Agregar' }} fecha meta de solución</b>
                                </v-alert>

                                <v-card-text>
                                    <v-form ref="formFechaMeta" @submit.prevent="guardarFechaMeta">
                                        <v-menu ref="menuFecha" v-model="menuFecha" :close-on-content-click="false"
                                            transition="scale-transition" offset-y min-width="auto">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field dense outlined v-model="formFechaMeta.fecha_meta_solucion"
                                                    label="Fecha meta estimada" readonly v-bind="attrs" v-on="on"
                                                    append-icon="mdi-calendar" />
                                            </template>
                                            <v-date-picker v-model="fechaMetaParseada" @input="menuFecha = false"
                                                locale="es" first-day-of-week="1" :min="fechaMinima" />
                                        </v-menu>
                                        <v-textarea v-if="esActualizacionFechaMeta" v-model="formFechaMeta.motivo"
                                            label="Motivo del cambio" outlined dense rows="2" auto-grow :rules="[
                                                v => !!v || 'El motivo es obligatorio',
                                                v => (v && v.length >= 10) || 'Debe tener mínimo 10 caracteres'
                                            ]" />
                                    </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer />
                                    <v-btn small color="error" @click="cerrarDialogoFecha()">Cancelar</v-btn>
                                    <v-btn small color="success" @click="guardarFechaMeta"
                                        :disabled="esActualizacionFechaMeta && (!formFechaMeta.motivo || formFechaMeta.motivo.length < 10)">
                                        Guardar
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <!-- Historial de cambios -->
                        <v-card v-if="historialFechas?.length" class="mt-4 pa-3" outlined>
                            <v-card-title class="text-body-2 font-weight-bold grey--text text--darken-2">
                                <v-icon class="mr-2" small color="indigo">mdi-history</v-icon>
                                Historial de cambios de fecha meta
                            </v-card-title>
                            <v-list dense>
                                <v-list-item v-for="(registro, index) in historialFechas" :key="index">
                                    <v-list-item-icon>
                                        <v-icon small color="grey darken-1">mdi-calendar-clock</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title class="text-caption">
                                            {{ formatFecha(registro.fecha_meta_solucion) }} - por {{ registro.usuario }}
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card>

                        <v-card-text>
                            <!-- Datos del Solicitante -->
                            <v-card class="mb-4 pa-4 elevation-1" v-if="mesaAyuda">
                                <v-card-title class="d-flex align-center text-subtitle-1 font-weight-bold mb-2">
                                    <v-icon color="primary" class="mr-2">mdi-account</v-icon>
                                    Datos del solicitante
                                    <v-divider class="mx-3" vertical></v-divider>
                                </v-card-title>
                                <v-row dense>
                                    <v-col cols="12" sm="3">
                                        <v-text-field outlined label="Radicado" v-model="mesaAyuda.id" readonly dense />
                                    </v-col>
                                    <v-col cols="12" sm="5">
                                        <v-text-field outlined label="Usuario registra"
                                            v-model="mesaAyuda.nombreoperador" readonly dense />
                                    </v-col>
                                    <v-col cols="12" sm="4">
                                        <v-text-field outlined label="Área" v-model="mesaAyuda.area" readonly dense />
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field outlined label="Asunto" v-model="mesaAyuda.asunto" readonly filled
                                            dense />
                                    </v-col>
                                    <v-col cols="12">
                                        <v-textarea outlined label="Descripción" v-model="mesaAyuda.descripcion"
                                            readonly auto-grow filled dense />
                                    </v-col>
                                    <v-col cols="12" sm="4">
                                        <v-text-field outlined label="Contacto" v-model="mesaAyuda.contacto" readonly
                                            dense />
                                    </v-col>
                                    <v-col cols="12" sm="4">
                                        <v-text-field outlined label="Correo electrónico" v-model="mesaAyuda.email"
                                            readonly dense />
                                    </v-col>
                                </v-row>
                            </v-card>

                            <!-- Respuestas anteriores -->
                            <v-card v-if="mesaAyuda.seguimiento_actividades?.length" class="mb-4 pa-4 elevation-1">
                                <v-card-title class="d-flex align-center text-subtitle-1 font-weight-bold mb-2">
                                    <v-icon color="indigo" class="mr-2">mdi-history</v-icon>
                                    Respuestas anteriores
                                    <v-divider class="mx-3" vertical></v-divider>
                                </v-card-title>

                                <v-container fluid class="px-0"
                                    style="max-height: 350px; overflow-y: auto; overflow-x: hidden; width: 100%;">
                                    <v-row dense v-for="(item, index) in mesaAyuda.seguimiento_actividades"
                                        :key="index">
                                        <v-col cols="12">
                                            <v-card outlined class="mb-3">
                                                <v-card-title
                                                    class="d-flex justify-space-between align-center px-3 py-1"
                                                    style="background-color: #f5f5f5;">
                                                    <div class="d-flex align-center">
                                                        <v-icon small class="mr-2" color="primary">mdi-account</v-icon>
                                                        <span class="text-body-2 font-weight-medium">
                                                            {{ item.user?.operador?.nombre_completo || 'Sin identificar'
                                                            }}
                                                        </span>
                                                    </div>
                                                    <div class="text-caption grey--text text--darken-1">
                                                        <v-icon small class="mr-1"
                                                            color="grey">mdi-calendar-clock</v-icon>
                                                        {{ item.created_at.slice(0, 16).replace('T', ' ') }}
                                                    </div>
                                                </v-card-title>

                                                <v-card-text class="pt-2">
                                                    <v-textarea v-model="item.respuesta" readonly auto-grow rows="2"
                                                        dense class="mt-2" />
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card>


                            <!-- Adjuntos -->
                            <v-card v-if="mesaAyuda.adjuntos_mesa_ayuda?.length" class="mb-4 pa-4 elevation-1">
                                <v-card-title class="d-flex align-center text-subtitle-1 font-weight-bold mb-2">
                                    <v-icon color="teal" class="mr-2">mdi-paperclip</v-icon>
                                    Adjuntos
                                    <v-divider class="mx-3" vertical></v-divider>
                                </v-card-title>
                                <v-row dense>
                                    <v-col v-for="(data, index) in mesaAyuda.adjuntos_mesa_ayuda" :key="index" cols="12"
                                        sm="6" md="4">
                                        <v-btn block color="info" @click="imprimirAdjunto(data.ruta)" dark>
                                            <v-icon left>mdi-cloud-upload</v-icon>
                                            {{ data.nombre }}
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card>

                            <!-- Gestión de Solicitud -->
                            <v-card class="pa-4 elevation-1">
                                <v-card-title class="d-flex align-center text-subtitle-1 font-weight-bold mb-2">
                                    <v-icon color="deep-purple" class="mr-2">mdi-clipboard-check-outline</v-icon>
                                    Gestión de la solicitud
                                    <v-divider class="mx-3" vertical></v-divider>
                                </v-card-title>
                                <v-row dense>
                                    <v-col cols="12" md="4">
                                        <v-select dense label="Acciones" :items="accionesFiltradas"
                                            v-model="accionSeleccionada" outlined />
                                        <span v-if="!formFechaMeta.fecha_meta_solucion"
                                            class="text-caption text--secondary red--text">
                                            <v-icon left color="warning">mdi-alert-decagram-outline</v-icon> Debes
                                            ingresar
                                            primero la fecha meta estimada para habilitar las demás acciones.
                                        </span>
                                    </v-col>

                                    <v-col v-if="accionSeleccionada === 'Reasignar'" cols="12">
                                        <v-autocomplete v-model="asignar.categoria" :items="categorias"
                                            item-text="nombre" item-value="id" label="Categoría" dense outlined />
                                    </v-col>

                                    <v-col
                                        v-if="['Solucionar', 'Reasignar', 'Comentarios al solicitante', 'Gestionando'].includes(accionSeleccionada)"
                                        cols="12">
                                        <v-textarea v-model="solucionar.respuesta" label="Motivo o respuesta" auto-grow
                                            dense outlined />
                                    </v-col>

                                    <v-col cols="12" sm="6" v-if="accionSeleccionada === 'Solucionar'">
                                        <v-file-input v-model="adjuntos" small-chips multiple outlined dense
                                            label="Adjuntar archivos"
                                            accept=".jpg,.jpeg,.png,.doc,.docx,.xml,.xls,.pdf" />
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-card-text>

                        <v-card-actions class="justify-end">
                            <v-btn color="red" small dark @click="limpiarDialogo()">Cerrar</v-btn>
                            <v-btn color="success" small dark @click="solucionarCaso()"
                                v-if="accionSeleccionada === 'Solucionar'">Solucionar</v-btn>
                            <v-btn color="warning" small dark @click="reasignar()"
                                v-if="accionSeleccionada === 'Reasignar'">Reasignar</v-btn>
                            <v-btn color="success" small dark @click="gestionando()"
                                v-if="accionSeleccionada === 'Gestionando'">Enviar
                                respuesta</v-btn>
                            <v-btn color="info" small dark @click="EnviarComentario()"
                                v-if="accionSeleccionada === 'Comentarios al solicitante'">Enviar comentario</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <v-col>
                    <v-row no-gutters style="background-color: white;">
                        <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                            <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                                @input="ListarCasosMesaAyuda()">
                            </v-pagination>
                        </v-col>
                        <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                            <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                                @change="ListarCasosMesaAyuda()">
                            </v-select>
                        </v-col>
                    </v-row>
                </v-col>
            </v-col>
        </v-card>
    </div>
</template>

<script>
import { mapActions } from "vuex"
export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('mesaAyuda.asignadas')) {
            return redirect('/');
        }
    },
    name: 'gestionMesaAyuda',

    data() {
        return {
            clienteSeleccionado: null,
            pendientesSumi: 0,
            clientes: [],
            dialogFechaMeta: false,
            menuFecha: false,
            casos: [],
            pagina: 1,
            total: 0,
            radicado_filtro: '',
            sede_filtro: '',
            dialogoPendientes: false,
            adjuntos_mesa_ayuda: [],
            adjuntos: [],
            area_filtro: '',
            opcionActual: 5,
            accionSeleccionada: '',
            motivo: false,
            anular: false,
            categorias: [],
            fechaEstimada: '',
            opciones: [5, 10, 20, 50, 100],
            buscar: '',
            sedes: [
                'SEDE SUMIMEDICAL ITAGÜÍ',
                'SUMIMEDICAL SEDE APOYO TERAPEUTICO',
                'SUMIMEDICAL SEDE PUERTO BERRIO',
                'SUMIMEDICAL RIONEGRO',
                'SUMIMEDICAL QUIBDO',
                'SUMIMEDICAL SEDE BUCARAMANGA',
                'SUMIMEDICAL SEDE TURBO',
                'SUMIMEDICAL COPACABANA',
                'SUMIMEDICAL SEDE CHIGORODÓ',
                'SUMIMEDICAL SEDE ORIENTAL',
                'SUMIMEDICAL SEDE VILLANUEVA',
                'SUMIMEDICAL SEDE ENVIGADO',
                'SUMIMEDICAL SEDE ESTADIO',
                'SUMIMEDICAL SAS BELLO',
                'CLINICA VICTORIANA',
                'SUMIMEDICAL ISTMINA',
                'SUMIMEDICAL SEDE 80',
                'SUMIMEDICAL SEDE AGUACATALA',
                'TRABAJO EN CASA',
                'SUMIMEDICAL SEDE CAUCASIA',
                'SUMIMEDICAL SEDE APARTADO',
            ],
            RespuestaSolicitud: ['Gestionando', 'Comentarios al solicitante', 'Reasignar', 'Solucionar'],
            solucionar: {
                respuesta: '',
                adjunto_id: ''
            },
            mesaAyuda: {
                id: '',
                email: '',
                area: '',
                nombrePrioridad: '',
                asunto: '',
                contacto: '',
                descripcion: '',
            },
            formFechaMeta: {
                fecha_meta_solucion: '',
                motivo: ''
            },
            fechaMetaActual: null,
            historialFechas: [],
            fechaMinima: new Date().toISOString().split('T')[0],
            headers: [{
                text: ' # Radicado',
                value: 'id'
            },
            {
                text: 'Área',
                value: 'area'
            },
            {
                text: 'Asunto',
                value: 'asunto'
            },
            {
                text: 'Categoría',
                value: 'categoria_mesa_ayuda.nombre'
            },
            {
                text: 'Sede Reportante',
                value: 'SedeNombre'
            },
            {
                text: 'Estado',
                value: 'nombreEstado'
            },
            {
                text: 'Fecha Creación',
                value: 'fechacreacion'
            },
            {
                text: 'Acciones',
                value: 'actions'
            },

            ],
            asignar: {
                categoria: null
            }
        }
    },

    mounted() {
        this.ListarCasosMesaAyuda();
        this.listarClientesMesaAyuda();
    },

    watch: {
        accionSeleccionada(val) {
            if (val === 'Reasignar') {
                this.fetchCategorias();
            }
        },

        'formFechaMeta.fecha_meta_solucion'(val) {
            if (val) {
                const formateada = this.$moment(val).format('YYYY-MM-DD');
                if (val !== formateada) {
                    this.formFechaMeta.fecha_meta_solucion = formateada;
                }
            }
        }
    },

    computed: {
        accionesFiltradas() {
            return this.formFechaMeta.fecha_meta_solucion
                ? this.RespuestaSolicitud
                : ['Reasignar'];
        },
        fechaMeta() {
            return this.formFechaMeta.fecha_meta_solucion;
        },
        fechaMetaParseada: {
            get() {
                if (!this.formFechaMeta.fecha_meta_solucion) return null;

                const date = new Date(this.formFechaMeta.fecha_meta_solucion);
                if (isNaN(date.getTime())) return null;

                // Retorna en formato YYYY-MM-DD que espera el date picker
                return date.toISOString().split('T')[0];
            },
            set(value) {
                this.formFechaMeta.fecha_meta_solucion = value;
            }
        },
        esActualizacionFechaMeta() {
            return !!this.mesaAyuda?.fecha_meta_solucion;
        }

    },
    methods: {
        ...mapActions('app', ['setPreload']),

        async ListarCasosMesaAyuda() {
            this.setPreload(true);
            const params = {
                page: this.pagina,
                cantidad: this.opcionActual,
                radicado_filtro: this.radicado_filtro,
                sede_filtro: this.sede_filtro,
                cliente_filtro: this.clienteSeleccionado
            };

            try {
                const res = await this.$axios.get('/mesa-ayuda/listarAsignados', { params });
                const { data, last_page } = res.data;
                const { data: casos, total } = data;

                this.casos = casos;
                this.total = last_page;
                this.pendientesSumi = total;

                return casos;
            } catch (e) {
                console.error(e);
            } finally {
                this.setPreload(false);
            }
        },


        buscarClientePorId(id) {
            this.clienteSeleccionado = id;
            this.ListarCasosMesaAyuda();
        },

        Pendientes(item) {
            this.dialogoPendientes = false;

            this.$nextTick(() => {
                this.mesaAyuda = item;
                this.formFechaMeta.fecha_meta_solucion = item.fecha_meta_solucion || '';
                this.fechaMetaActual = item.fecha_meta_solucion || null;
                this.dialogoPendientes = true;
            });
        },

        async imprimirAdjunto(ruta) {
            try {
                this.setPreload(true)
                let adj = await this.$adjuntos(ruta);
                let blob = new Blob([adj[1]], {
                    type: adj[0],
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                this.$toast.error('El adjunto no se pudo encontrar!')
                console.log(error.response);
            } finally {
                this.setPreload(false)
            }
        },

        colorPrioridad(Prioridad) {
            switch (Prioridad) {
                case 'Alta':
                    return 'red';
                case 'Media':
                    return 'orange';
                case 'Baja':
                    return 'green';
                default:
                    return '';
            }
        },

        limpiarFiltro() {
            this.radicado_filtro = '',
                this.sede_filtro = '',
                this.ListarCasosMesaAyuda()
        },

        limpiarDialogo() {
            this.dialogoPendientes = false;
            this.mesaAyuda = {
                id: '',
                email: '',
                area: '',
                nombrePrioridad: '',
                asunto: '',
                contacto: '',
                descripcion: '',
            };
            this.asignar = {
                categoria: ''
            };
            this.accionSeleccionada = '';
            this.motivo = false;
            this.anular = false;
            this.fechaEstimada = '';
            this.solucionar.respuesta = ''
            this.adjuntos = []
        },

        solucionarCaso() {
            let formData = new FormData();
            formData.append(`respuesta`, this.solucionar.respuesta);
            for (let i = 0; i < this.adjuntos.length; i++) {
                formData.append(`adjuntos[]`, this.adjuntos[i]);
            }
            this.setPreload(true);
            this.$axios.post(`/mesa-ayuda/solucionar/${this.mesaAyuda.id}`, formData)
                .then(response => {
                    this.dialogoPendientes = false;
                    this.ListarCasosMesaAyuda();
                    this.limpiarDialogo()
                    this.$emit("updateCount");
                    this.$toast.success('datos guardados exitosamente.');
                })
                .catch(error => {
                    console.log(error);
                }).finally(() => {
                    this.setPreload(false);
                });
        },

        async fetchCategorias() {
            this.loading = true
            try {
                const response = await this.$axios.get('/CategoriaMesaAyuda/listar');
                this.loading = false
                this.categorias = response.data
            } catch (error) {
                console.error(error);
                this.loading = false;
                this.$toast.error('No se pudo obtener la lista de categorías.');
            }
        },

        async reasignar() {
            if (!this.asignar.categoria || !this.solucionar.respuesta) {
                await this.$swal({
                    title: "¡Error!",
                    text: "Debe ingresar tanto la categoria como el motivo.",
                    type: "warning",
                });
                return;
            }
            const result = await this.$swal({
                title: "Atención!",
                text: "¿Esta seguro de reasignar esta solicitud?.",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, reasignar',
                cancelButtonText: 'Cancelar'
            });
            if (result.value) {
                this.setPreload(true);
                const data = {
                    categoria_mesa_ayuda_id: this.asignar.categoria,
                    motivo: this.solucionar.respuesta
                };
                try {
                    await this.$axios.post(`mesa-ayuda/reasignar/${this.mesaAyuda.id}`, data);
                    this.dialogoPendientes = false;
                    this.ListarCasosMesaAyuda();
                    this.limpiarDialogo();
                    this.$toast.success('Caso reasignado exitosamente.');
                } catch (error) {
                    console.error(error);
                    this.$toast.error('Error al reasignar el caso.');
                } finally {
                    this.setPreload(false);
                }
            }
        },

        async gestionando() {
            if (!this.solucionar.respuesta) {
                await this.$swal({
                    title: "¡Error!",
                    text: "Debe ingresar el motivo para gestionar la solicitud.",
                    type: "warning",
                });
                return;
            }
            const result = await this.$swal({
                title: "Atención!",
                text: "¿Está seguro de gestionar esta solicitud?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, gestionar',
                cancelButtonText: 'Cancelar'
            });
            if (result.value) {
                this.setPreload(true);
                const data = {
                    motivo: this.solucionar.respuesta
                };
                try {
                    await this.$axios.post(`mesa-ayuda/gestionando/${this.mesaAyuda.id}`, data);
                    this.dialogoPendientes = false;
                    this.ListarCasosMesaAyuda();
                    this.limpiarDialogo();
                    this.$toast.success('Solicitud gestionada exitosamente.');
                } catch (error) {
                    console.error(error);
                    this.$toast.error('Error al gestionar la solicitud.');
                } finally {
                    this.setPreload(false);
                }
            }
        },

        async EnviarComentario() {
            if (!this.solucionar.respuesta) {
                await this.$swal({
                    title: "¡Error!",
                    text: "Debe ingresar un comentario para enviar al solicitante.",
                    type: "warning",
                });
                return;
            }
            const result = await this.$swal({
                title: "Atención!",
                text: "¿Está seguro de enviar este comentario al solicitante?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, enviar',
                cancelButtonText: 'Cancelar'
            });
            if (result.value) {
                this.setPreload(true);
                const data = {
                    motivo: this.solucionar.respuesta
                };
                try {
                    await this.$axios.post(`mesa-ayuda/comentario/${this.mesaAyuda.id}`, data);
                    this.dialogoPendientes = false;
                    this.ListarCasosMesaAyuda();
                    this.limpiarDialogo();
                    this.$toast.success('Comentario enviado exitosamente.');
                } catch (error) {
                    console.error(error);
                    this.$toast.error('Error al enviar el comentario.');
                } finally {
                    this.setPreload(false);
                }
            }
        },

        async imprimirAdjunto(ruta) {
            try {
                this.setPreload(true)
                let adj = await this.$adjuntos(ruta);
                let blob = new Blob([adj[1]], {
                    type: adj[0],
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                this.$toast.error('El adjunto de la factura no existe!')
                console.log(error.response);
            } finally {
                this.setPreload(false)
            }
        },

        guardarFechaMeta() {
            if (!this.formFechaMeta.fecha_meta_solucion) {
                this.$toast.error('Debe seleccionar una fecha meta válida.');
                return;
            }

            this.setPreload(true);

            const payload = {
                fecha_meta_solucion: this.formFechaMeta.fecha_meta_solucion
            };

            if (this.fechaMeta && this.formFechaMeta.motivo) {
                payload.motivo = this.formFechaMeta.motivo;
            }

            this.$axios.post(`/mesa-ayuda/fecha-meta/${this.mesaAyuda.id}`, payload)
                .then(() => {
                    this.$toast.success('Fecha meta guardada exitosamente.');

                    const index = this.casos.findIndex(c => c.id === this.mesaAyuda.id);
                    if (index !== -1) {
                        this.$set(this.casos, index, {
                            ...this.casos[index],
                            fecha_meta_solucion: this.formFechaMeta.fecha_meta_solucion
                        });
                    }

                    this.mesaAyuda = {
                        ...this.casos.find(c => c.id === this.mesaAyuda.id)
                    };

                    this.fechaMetaActual = this.mesaAyuda.fecha_meta_solucion;

                    this.cerrarDialogoFecha();
                })
                .catch(error => {
                    console.error(error);
                    this.$toast.error(
                        error?.response?.data?.message || 'Error al guardar la fecha meta.'
                    );
                })
                .finally(() => {
                    this.setPreload(false);
                    this.limpiarDialogo();
                    this.ListarCasosMesaAyuda();
                    this.formFechaMeta.motivo = '';
                });
        },

        formatFecha(fecha) {
            if (!fecha) return '';
            const date = new Date(fecha);
            return date.toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

        cerrarDialogoFecha() {
            this.dialogFechaMeta = false;
            this.formFechaMeta.fecha_meta_solucion = '';
            this.fechaMetaActual = null;
            this.menuFecha = false;

            this.$nextTick(() => {
                this.$refs.formFechaMeta?.reset?.();
            });
        },

        async listarClientesMesaAyuda() {
            try {
                const res = await this.$axios.get("/clientesMesaAyuda/listar");
                this.clientes = res.data.map(c => ({
                    nombre: c.nombre,
                    pendientes: 0,
                    id: c.id
                }));
            } catch (error) {
                console.error(error);
                this.$toast.error("Error cargando cliente");
            }
        }

    }
}

</script>
