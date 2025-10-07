<template>
    <div>
        <v-row dense>
            <v-row class="my-8">
                <v-col cols="12" class="d-flex align-center">
                    <v-divider color="#43a047" style="flex: 1 1 auto;"></v-divider>

                    <div class="mx-4 d-flex align-center" style="color: #43a047;">
                        <v-icon class="mr-2" color="success">mdi-lightbulb-on</v-icon>
                        <span class="font-weight-bold text-subtitle-1">PLAN DE MEJORA</span>
                    </div>

                    <v-divider color="#43a047" style="flex: 1 1 auto;"></v-divider>
                </v-col>
            </v-row>

            <v-card-text>
                <v-row>
                    <v-col cols="10" sm="10" md="11">
                        <v-autocomplete clearable color="green" v-model="analisis.accion_mejora" :items="accion_mejoras"
                            label="Selecciona acciones de mejora" multiple chips small-chips deletable-chips dense
                            hide-no-data outlined
                            hint="Para identificar acciones de mejora que puedan ser seleccionadas en este campo, le recomendamos hacer clic en el icono '+' y agregarlas.">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="2" sm="2" md="1" v-if="eventoAdverso.estado_id != 17">
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn text icon color="success" dark v-on="on" @click="dialogoAccionMejora = true">
                                    <v-icon>mdi-plus</v-icon>
                                </v-btn>
                            </template>
                            <span>Agregar nueva acción de mejora</span>
                        </v-tooltip>

                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn icon text color="red" dark v-on="on" @click="limpiarAccionesSeleccionadas">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </template>
                            <span>Limpiar acciones seleccionadas</span>
                        </v-tooltip>
                    </v-col>
                    <template>
                        <v-expansion-panels>
                            <v-expansion-panel v-for="(item, i) in analisis.accion_mejora" :key="i">
                                <v-expansion-panel-header disable-icon-rotate color="green lighten-5"
                                    style="text-transform:uppercase">
                                    <template v-slot:actions>
                                        <v-icon color="green darken-4">
                                            mdi-file-document-plus
                                        </v-icon>
                                    </template>
                                    <b style="color:darkgreen">{{ item }}</b>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <!-- FORMULARIO PLAN DE MEJORA -->
                                    <br>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="12">
                                                <v-autocomplete multiple :items="listaEmpleados" chips small-chips
                                                    item-text="nombre" item-value="id" deletable-chips
                                                    v-model="analisis.user_responsable_id" label="Responsable" dense
                                                    outlined>
                                                </v-autocomplete>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field dense v-model="analisis.fecha_cumplimiento" outlined
                                                    label="Fecha de cumplimiento" type="date">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field dense v-model="analisis.fecha_seguimiento" outlined
                                                    label="Fecha de seguimiento" type="date">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-select dense v-model="analisis.estado" outlined
                                                    :items="['PENDIENTE', 'CUMPLIDO']" label="Estado">
                                                </v-select>
                                            </v-col>
                                        </v-row>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn small color="success" @click="guardarAccionMejora()">Guardar acción
                                                de
                                                mejora</v-btn>
                                        </v-card-actions>
                                    </v-container>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </template>
                </v-row>
            </v-card-text>
            <v-dialog v-model="dialogoAccionMejora" max-width="800px">
                <v-card>
                    <v-card-title>
                        <v-toolbar flat>
                            <v-toolbar-title>
                                <div class="d-flex align-center">
                                    <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                                    <span>Registro de acciones de mejora</span>
                                </div>
                            </v-toolbar-title>
                            <v-divider class="mx-4" inset vertical></v-divider>
                        </v-toolbar>
                    </v-card-title>
                    <v-container>
                        <v-combobox outlined small-chips deletable-chips dense v-model="nuevaAccionMejora" multiple
                            chips
                            hint="Indique las acciones de mejora que desee incluir. Utilice la tecla Enter para separar y agregar múltiples acciones."
                            :items="[]">
                        </v-combobox>
                    </v-container>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small color="error" @click="dialogoAccionMejora = false">Cancelar</v-btn>
                        <v-btn small color="success" @click="agregarAccionMejora">Agregar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-row dense>
                <v-container>
                    <v-row dense>
                        <!-- LISTA DE ACCIONES DE MEJORA -->
                        <v-expansion-panels>
                            <v-expansion-panel v-for="(item, i) in accionesMejoraEvento" :key="i">
                                <v-expansion-panel-header color="green lighten-5" style="text-transform:uppercase">
                                    <template v-slot:actions>
                                        <v-icon color="green darken-4">
                                            mdi-chevron-down-circle-outline
                                        </v-icon>
                                    </template>
                                    <b style="color:darkgreen">{{ item.nombre }}</b>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <!-- FORMULARIO PLAN DE MEJORA -->
                                    <br>
                                    <v-container>
                                        <v-row dense>
                                            <v-col cols="12" sm="6" md="12">
                                                <v-text-field outlined item-value="id" v-model="item.nombre"
                                                    label="Nombre" dense>
                                                </v-text-field>
                                            </v-col>
                                            <v-col>
                                                <h4>Responsables:</h4>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="12">
                                                <v-chip color="blue-grey" dark small label
                                                    v-for="(evento, index) in item.eventos_asignados" :key="index">
                                                    {{ evento?.user?.operador ? `${evento.user.operador.nombre ||
                                                        ''}${evento.user.operador.apellido || ''}`.trim() || 'Sin nombre' :
                                                        'Sin nombre' }}
                                                </v-chip>

                                                <v-col></v-col>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field outlined type="date" dense
                                                    v-model="item.fecha_cumplimiento" label="Fecha de cumplimiento">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field outlined type="date" dense
                                                    v-model="item.fecha_seguimiento" label="Fecha de seguimiento">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-select outlined dense v-model="item.estado"
                                                    :items="['PENDIENTE', 'CUMPLIDO']" label="Estado">
                                                </v-select>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-textarea outlined auto-grow dense v-model="item.observacion"
                                                    label="Observación de seguimiento">
                                                </v-textarea>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-alert text dense border="left" color="blue-grey"
                                                    icon="mdi-paperclip"><b>Adjuntos
                                                        plan
                                                        mejora</b>
                                                </v-alert>
                                                <v-btn style="margin-right:7px" small
                                                    v-for="(adjuntoR, index) in item.adjuntos" :key="index">
                                                    <a @click="consultarAdjunto(adjuntoR.ruta)">
                                                        Adjunto
                                                        {{ index + 1 }}
                                                    </a>
                                                    <v-icon right color="info">mdi-download-circle</v-icon>
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                        <v-card-actions v-if="eventoAdverso.estado_id != 17">
                                            <v-spacer></v-spacer>
                                            <v-btn color="error" small @click="eliminarRegistro(item)">Eliminar
                                                <v-icon right>mdi-delete</v-icon>
                                            </v-btn>
                                            <v-btn color="success" small
                                                @click="ActualizarAccionMejora(item)">Actualizar plan de
                                                mejora
                                                <v-icon right>mdi-update</v-icon>
                                            </v-btn>
                                        </v-card-actions>
                                    </v-container>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-row>
                    <v-col cols="12"></v-col>
                </v-container>
            </v-row>
        </v-row>

        <!-- SOPORTE Y EVIDENCIAS PLAN DE MEJORA -->
        <v-row dense v-if="accionesMejoraEvento.length > 0">
            <v-col cols="12">
                <v-alert border="left" text dense color="blue-grey" icon="mdi-folder-eye">Registro de soporte y
                    evidencias plan
                    de
                    mejora
                </v-alert>
            </v-col>
            <v-container>
                <v-col cols="12" sm="12" md="12" v-if="accionesMejoraEvento">
                    <v-autocomplete outlined dense :items="accionesMejoraEvento" item-value="id"
                        :item-text="concatenarAccionMejora" v-model="soporteAccionMejora.accion_mejora_id"
                        label="Acción de mejora"
                        hint="Seleccione la acción de mejora a la cual desea registrar el soporte" persistent-hint>
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-textarea outlined v-model="soporteAccionMejora.observacion" auto-grow dense
                        label="Observaciones">
                    </v-textarea>
                </v-col>
                <!-- Adjuntos -->
                <v-col cols="12" sm="6">
                    <v-file-input counter show-size truncate-length="10" v-model="adjuntos" small-chips multiple
                        outlined dense label="Adjuntar soportes"></v-file-input>
                </v-col>


                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="boton" dark @click="guardarSoporteAccionMejora()">
                        Registrar soporte
                        <v-icon dark right>
                            mdi-content-save
                        </v-icon>
                    </v-btn>
                </v-card-actions>
            </v-container>
        </v-row>
    </div>
</template>

<script>
import {
    mapActions
} from "vuex"
export default {
    name: 'WorkspaceJsonPlanMejoraComponente',

    data() {
        return {
            adjuntos: [],
            nuevaAccionMejora: [],
            accion_mejoras: [],
            accionesMejoraEvento: [],
            dialogoAccionMejora: false,
            listaEmpleados: [],
            analisis: {
                nombre: '',
                fecha_cumplimiento: '',
                fecha_seguimiento: '',
                estado: '',
                analisis_evento_id: '',
                user_responsable_id: ''
            },
            dialogPlan: false,
            soporteAccionMejora: {
                observacion: '',
            },
        };
    },

    mounted() {
        this.listarEmpleados()
    },

    props: {
        eventoAdverso: Object,
    },

    methods: {

        ...mapActions("app", ["setPreload"]),

        concatenarAccionMejora(listarAccionesMejora) {
            return `${listarAccionesMejora.nombre}`;
        },

        listarAccionesMejora() {
            this.setPreload(true);
            this.$axios.get('/accion-mejora-eventos/' + this.eventoAdverso.analisis_evento.id).then(res => {
                this.accionesMejoraEvento = res.data
            }).catch(e => {
                console.log(e.response.data);
                this.accionesMejoraEvento = []
            }).finally(() => {
                this.setPreload(false);
            });
        },

        guardarAccionMejora() {
            this.analisis.nombre = this.analisis.accion_mejora[0]
            this.analisis.analisis_evento_id = this.eventoAdverso.analisis_evento.id
            this.analisis.evento_adverso_id = this.eventoAdverso.id,
                this.setPreload(true);
            this.$axios.post('/accion-mejora-eventos/crear', this.analisis).then(res => {
                this.$toast.success('Plan de mejora registrado con éxito');
                this.limpiarAnalisis();
                this.$emit('accion-mejora-registrada')
            }).catch(e => {
                this.$toast.error('Todos los campos son obligatorios')
            }).finally(() => {
                this.setPreload(false);
            });
        },

        listarEmpleados() {
            this.$axios.get('/operador/listarActivos').then(res => {
                this.listaEmpleados = res.data.map((empleado) => {
                    return {
                        id: empleado.user_id,
                        nombre: `${empleado.documento} - ${empleado.nombre_completo}`
                    }
                })
            }).catch(error => {
                this.$toast.error(error.response.data.mensaje)
            })
        },

        agregarAccionMejora() {
            if (this.nuevaAccionMejora.length <= 0) return this.$swal({
                title: "¡No puede ser!",
                text: "Es necesario especificar el nombre de la acción de mejora para poder incorporarla al plan de mejora.",
                type: "error",
            });
            for (let i = 0; i < this.nuevaAccionMejora.length; i++) {
                let str =
                    this.nuevaAccionMejora[i].charAt(0).toUpperCase() +
                    this.nuevaAccionMejora[i].slice(1);
                this.accion_mejoras.push(str);
            }
            this.nuevaAccionMejora = [];
            this.dialogoAccionMejora = false;
        },

        ActualizarAccionMejora(item) {
            this.setPreload(true);
            this.$axios.post('/accion-mejora-eventos/' + item.id, item)
                .then(res => {
                    return this.$toast.success('Se ha actualizado la acción de mejora correctamente')
                }).finally(() => {
                    this.$emit('respuestaComponente');
                    this.setPreload(false);
                });
        },

        eliminarRegistro(item) {
            this.$axios.post(`/accion-mejora-eventos/${item.id}/eliminar`).then((response) => {
                this.$toast.success(response.data.mensaje);
                this.$emit('plan-mejora-eliminado')
            })
                .catch((error) => {
                    this.$toast.error(error.response.data.mensaje || 'Error al actualizar');
                });
        },

        async consultarAdjunto(ruta) {
            try {
                let adj = await this.$adjuntos(ruta);
                let blob = new Blob([adj[1]], {
                    type: adj[0],
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                console.log(error.Response);
            }
        },

        guardarSoporteAccionMejora() {
            if (!this.soporteAccionMejora.accion_mejora_id) {
                this.$toast.error('Debes seleccionar una acción de mejora.');
                return;
            }

            if (!this.soporteAccionMejora.observacion) {
                this.$toast.error('Debes proporcionar tus observaciones.');
                return;
            }

            if (this.adjuntos.length < 1) {
                this.$toast.error('Debes adjuntar el soporte de evidencia.');
                return;
            }
            const formData = new FormData();
            formData.append(`observacion`, this.soporteAccionMejora.observacion);
            formData.append(`accion_mejora_id`, this.soporteAccionMejora.accion_mejora_id);
            for (let i = 0; i < this.adjuntos.length; i++) {
                formData.append(`adjuntos[]`, this.adjuntos[i]);
            }
            this.setPreload(true);
            this.$axios
                .post(`/accion-mejora-eventos/` + this.soporteAccionMejora.accion_mejora_id, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then((res) => {
                    this.$toast.success("Se ha registrado el soporte sobre la acción de mejora.");
                    this.limpiarSoporte();
                })
                .catch((e) => {
                    this.$toast.error("Ocurrió un error al intentar registrar el soporte sobre la acción de mejora.");
                    console.log(e);
                })
                .finally(() => {
                    this.setPreload(false);
                    this.$emit('respuestaComponente');
                });

        },

        limpiarAnalisis() {
            this.analisis.responsable = '',
                this.analisis.fecha_cumplimiento = '',
                this.analisis.fecha_seguimiento = '',
                this.analisis.estado = ''
        },


        limpiarSoporte() {
            this.soporteAccionMejora.accion_mejora_id = '',
                this.soporteAccionMejora.observacion = '',
                this.adjuntos = []
        },

        emitirEventoLimpiar() {
            this.accion_mejoras = []
        },

        limpiarAccionesSeleccionadas() {
            this.analisis.accion_mejora = []
        }
    },
};

</script>
