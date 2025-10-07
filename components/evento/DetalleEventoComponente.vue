<template>
    <div>
        <v-card-title>
            <v-toolbar flat class="d-flex flex-wrap align-center">
                <v-toolbar-title class="d-flex align-center">
                    <img src="/images/ojo.svg" alt="Gestión Sucesos Clínicos" height="50px" width="50px" />
                    <span class="ml-2 font-weight-bold">Detalle suceso</span>
                </v-toolbar-title>

                <v-divider class="mx-4" inset vertical></v-divider>
                <small>{{ eventoAdverso.id }}</small>
            </v-toolbar>
        </v-card-title>
        <v-row dense>
            <v-col v-if="eventoAdverso.afiliado_id" cols="12">
                <v-text-field outlined dense :value="nombreAfiliadoEvento" label="Afiliado relacionado" readonly />
            </v-col>
            <v-col v-if="eventoAdverso.afiliado?.numero_documento" cols="6">
                <v-text-field outlined dense v-model="eventoAdverso.afiliado.numero_documento" label="Documento afiliado"
                    readonly>
                </v-text-field>
            </v-col>
            <v-col v-if="eventoAdverso.afiliado?.sexo" cols="3">
                <v-text-field outlined dense v-model="eventoAdverso.afiliado.sexo" label="Género" readonly>
                </v-text-field>
            </v-col>
            <v-col v-if="eventoAdverso.afiliado?.edad_cumplida" cols="3">
                <v-text-field outlined dense v-model="eventoAdverso.afiliado.edad_cumplida" label="Edad" readonly>
                </v-text-field>
            </v-col>
            <v-col v-if="eventoAdverso.afiliado?.entidad?.nombre" cols="12">
                <v-text-field dense outlined v-model="eventoAdverso.afiliado.entidad.nombre" label="Entidad afiliado" readonly>
                </v-text-field>
            </v-col>
            <v-col cols="12">
                <v-autocomplete outlined :error-messages="errors.suceso_id" dense v-model="eventoAdverso.suceso_id"
                    :items="sucesos" label="Suceso" item-text="nombre" item-value="id" @input="listarClasiAreas"
                    :loading="loading.sucesos" @change="resetClasificacionArea"
                    :readonly="!$can('eventoAdverso.actualizarEvento')"></v-autocomplete>
            </v-col>
            <v-col cols="12" v-if="mostrarClasificacionArea">
                <v-autocomplete dense outlined v-model="eventoAdverso.clasificacion_area_id" :items="clasifAreas"
                    :loading="loading.clasif_areas" :error-messages="errors.clasificacion_area_id"
                    label="Clasificación de área" item-text="nombre" item-value="id" @input="listarTiposEventos"
                    :readonly="!$can('eventoAdverso.actualizarEvento')">
                </v-autocomplete>
            </v-col>
            <v-col cols="12" v-if="eventoAdverso.suceso_id == 139">
                <v-autocomplete dense outlined v-model="eventoAdverso.relacion" :items="relacionesTecnovigilancia"
                    label="Relacionado con"></v-autocomplete>
            </v-col>
            <v-col cols="12" v-if="mostrarTipoEvento">
                <v-autocomplete dense outlined v-model="eventoAdverso.tipo_evento_id" :error-messages="errors.tipo_evento_id"
                    :items="tiposEventos" label="Tipo de evento" item-text="nombre" item-value="id"
                    :loading="loading.tipo_eventos"
                    :readonly="!$can('eventoAdverso.actualizarEvento')"></v-autocomplete>
            </v-col>
            <v-col cols="12">
                <v-autocomplete outlined :items="listaOperadores" item-text="nombre" item-value="user_id"
                    v-model="eventoAdverso.profesional_id" label="Profesional tratante" dense
                    :loading="loading.operadores"></v-autocomplete>
            </v-col>
            <v-col cols="12">
                <v-autocomplete outlined v-model="eventoAdverso.sede_ocurrencia_id" label="Sede de ocurrencia" :items="reps"
                    no-data-text="Debe ingresar el nombre de una sede para iniciar la búsqueda" item-value="id"
                    item-text="nombre" :search-input.sync="rep" dense></v-autocomplete>

            </v-col>
            <v-col cols="12">
                <v-autocomplete outlined :error-messages="errors.sede_reportante_id" v-model="eventoAdverso.sede_reportante_id"
                    no-data-text="Debe ingresar el nombre de una sede para iniciar la búsqueda" label="Sede reportante"
                    :items="repsReporta" item-value="id" item-text="nombre" :search-input.sync="repReporta" dense>
                </v-autocomplete>

            </v-col>
            <v-col cols="6">
                <v-text-field outlined :readonly="!$can('eventoAdverso.actualizarEvento')" type="date" dense
                    v-model="eventoAdverso.fecha_ocurrencia" label="Fecha ocurrencia">
                </v-text-field>
            </v-col>
            <v-col cols="6">
                <v-text-field outlined type="date" dense v-model="fechaCreacion" label="Fecha reporte" readonly>
                </v-text-field>
            </v-col>
            <v-col cols="12"
                v-if="$can('eventoAdverso.asignar') && eventoAdverso?.user_registra?.operador">
                <v-text-field dense outlined
                    :value="eventoAdverso.user_registra.operador.nombre + ' ' + eventoAdverso.user_registra.operador.apellido"
                    label="Usuario registra" readonly>
                </v-text-field>
            </v-col>
            <v-col cols="12"
                v-if="$can('eventoAdverso.asignar') && eventoAdverso?.user_registra?.operador?.cargo?.nombre">
                <v-text-field dense v-model="eventoAdverso.user_registra.operador.cargo.nombre" label="Cargo registra"
                    readonly outlined>
                </v-text-field>
            </v-col>
            <v-col cols="12" v-if="eventoAdverso.afiliado?.ips?.nombre">
                <v-text-field outlined dense v-model="eventoAdverso.afiliado.ips.nombre" label="IPS primaria" readonly>
                </v-text-field>
            </v-col>
            <v-col cols="12">
                <v-alert v-if="eventoAdverso.relacion === 'Dispositivos' || eventoAdverso.relacion === 'Ambos'" text
                    dense border="left" color="blue-grey" icon="mdi-pill">
                    Dispositivo</v-alert>
            </v-col>
            <!-- <v-col cols="12" v-if="eventoAdverso.relacion === 'Dispositivos' || eventoAdverso.relacion === 'Ambos'">
				<v-text-field dense v-model="eventoAdverso.dispositivo" label="Dispositivo">
				</v-text-field>
			</v-col> -->

            <v-col cols="12"
                v-if="eventoAdverso.relacion === 'Dispositivos' || eventoAdverso.relacion === 'Ambos'">
                <v-autocomplete outlined dense v-model="eventoAdverso.dispositivo_id" :search-input.sync="medicamento"
                    no-data-text="Debe ingresar el nombre del medicamento para iniciar la búsqueda"
                    :items="medicamentos" label="Dispositivo" item-text="nombre" item-value="id">
                </v-autocomplete>
            </v-col>

            <v-col cols="12"
                v-if="eventoAdverso.relacion === 'Dispositivos' || eventoAdverso.relacion === 'Ambos'">
                <v-text-field outlined dense v-model="eventoAdverso.referencia_dispositivo" label="Referencia dispositivo">
                </v-text-field>
            </v-col>
            <v-col cols="12"
                v-if="eventoAdverso.relacion === 'Dispositivos' || eventoAdverso.relacion === 'Ambos'">
                <v-text-field outlined dense v-model="eventoAdverso.marca_dispositivo" label="Marca dispositivo">
                </v-text-field>
            </v-col>
            <v-col cols="12"
                v-if="eventoAdverso.relacion === 'Dispositivos' || eventoAdverso.relacion === 'Ambos'">
                <v-text-field outlined dense v-model="eventoAdverso.lote_dispositivo" label="Lote dispositivo">
                </v-text-field>
            </v-col>
            <v-col cols="12"
                v-if="eventoAdverso.relacion === 'Dispositivos' || eventoAdverso.relacion === 'Ambos'">
                <v-text-field outlined dense v-model="eventoAdverso.invima_dispositivo" label="Invima dispositivo">
                </v-text-field>
            </v-col>
            <v-col cols="12"
                v-if="eventoAdverso.relacion === 'Dispositivos' || eventoAdverso.relacion === 'Ambos'">
                <v-text-field outlined dense v-model="eventoAdverso.fabricante_dispositivo" label="Fabricante dispositivo">
                </v-text-field>
            </v-col>
            <v-col cols="12">
                <v-alert v-if="eventoAdverso.relacion === 'Equipo biomédico' || eventoAdverso.relacion === 'Ambos'" text
                    dense border="left" color="blue-grey" icon="mdi-devices">
                    Equipo biomédico</v-alert>
            </v-col>
            <v-col cols="12"
                v-if="eventoAdverso.relacion === 'Equipo biomédico' || eventoAdverso.relacion === 'Ambos'">
                <v-text-field outlined dense v-model="eventoAdverso.nombre_equipo_biomedico" label="Nombre de quipo biomédico">
                </v-text-field>
            </v-col>
            <v-col cols="12"
                v-if="eventoAdverso.relacion === 'Equipo biomédico' || eventoAdverso.relacion === 'Ambos'">
                <v-text-field outlined dense v-model="eventoAdverso.serie_equipo_biomedico" label="Serie equipo biomédico">
                </v-text-field>
            </v-col>
            <v-col cols="12"
                v-if="eventoAdverso.relacion === 'Equipo biomédico' || eventoAdverso.relacion === 'Ambos'">
                <v-text-field outlined dense v-model="eventoAdverso.modelo_equipo_biomedico" label="Modelo equipo biomédico">
                </v-text-field>
            </v-col>
            <v-col cols="12"
                v-if="eventoAdverso.relacion === 'Equipo biomédico' || eventoAdverso.relacion === 'Ambos'">
                <v-text-field outlined dense v-model="eventoAdverso.marca_equipo_biomedico" label="Marca equipo biomédico">
                </v-text-field>
            </v-col>
            <v-col cols="12"
                v-if="eventoAdverso.relacion === 'Equipo biomédico' || eventoAdverso.relacion === 'Ambos'">
                <v-text-field outlined dense v-model="eventoAdverso.invima_equipo_biomedico" label="Invima equipo biomédico">
                </v-text-field>
            </v-col>
            <v-col cols="12"
                v-if="eventoAdverso.relacion === 'Equipo biomédico' || eventoAdverso.relacion === 'Ambos'">
                <v-text-field dense v-model="eventoAdverso.fabricante_biomedico" label="Fabricante equipo biomédico">
                </v-text-field>
            </v-col>
            <!--Servicio de ocurrencia si la sede de ocurrencia es victoriana-->
            <v-col v-if="eventoAdverso.sede_ocurrencia_id === 13742" cols="12">
                <v-autocomplete outlined :items="serviciosOcurrencias" dense v-model="eventoAdverso.servicio_ocurrencia"
                    label="Servicio de ocurrencia" :readonly="!$can('eventoAdverso.actualizarEvento')">
                </v-autocomplete>
            </v-col>
            <!--Servicio reportante si la sede reportante es victoriana-->
            <v-col v-if="eventoAdverso.sede_reportante_id === 13742" cols="12">
                <v-autocomplete outlined :items="serviciosOcurrencias" dense v-model="eventoAdverso.servicio_reportante"
                    label="Servicio reportante" :readonly="!$can('eventoAdverso.actualizarEvento')">
                </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-textarea outlined dense :error-messages="errors.descripcion_hechos" v-model="eventoAdverso.descripcion_hechos"
                    label="Descripción de los hechos" readonly>
                </v-textarea>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-textarea outlined auto-grow dense :error-messages="errors.accion_tomada" v-model="eventoAdverso.accion_tomada"
                    label="Acciones tomadas" readonly>
                </v-textarea>
            </v-col>
            <v-col cols="12" v-if="eventoAdverso?.analisis_evento?.severidad_evento">
                <v-text-field outlined dense v-model="eventoAdverso.analisis_evento.severidad_evento"
                    label="Severidad del evento">
                </v-text-field>
            </v-col>
            <v-container fluid>
                <v-row dense>
                    <v-col cols="7">
                        <v-alert text dense border="left" color="blue-grey" type="info" icon="mdi-account-multiple">
                            <b>Responsables</b>
                        </v-alert>
                        <small style="margin-left:2px" dense expand v-for="(item, i) in usuariosAsignados" :key="i">
                            <v-chip label color="blue-grey lighten-1" dark small>{{ item.nombre_empleado }}</v-chip>
                        </small>
                    </v-col>
                    <v-col cols="5">
                        <v-alert text dense border="left" color="blue-grey" type="info" icon="mdi-paperclip"><b>Adjuntos
                                reporte</b>
                        </v-alert>
                        <v-btn style="margin-right:7px" small v-for="(adjuntoR, index) in eventoAdverso.adjuntos"
                            :key="index">
                            <a @click="consultarAdjunto(adjuntoR.ruta)">
                                Adjunto
                                {{ index + 1 }}
                            </a>
                            <v-icon right color="info">mdi-download-circle</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-row>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="$can('eventoAdverso.actualizarEvento') && eventoAdverso.estado_id != 17" small color="boton"
                dark @click="actualizarEvento()">
                Actualizar reporte
                <v-icon dark right>
                    mdi-update
                </v-icon>
            </v-btn>
        </v-card-actions>
    </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
    name: 'WorkspaceJsonDetalleEventoComponente',
    props: {
        eventoAdverso: {
            type: Object,
            default: () => ({})
        }
    },

    data() {
        return {
            errors: {
                clasificacion_area_id: '',
                tipo_evento_id: '',
                suceso_id: '',
                accion_tomada: '',
                descripcion_hechos: '',
            },
            listaOperadores: [],
            usuariosAsignados: [],
            sucesos: [],
            clasifAreas: [],
            reps: [],
            repsReporta: [],
            tiposEventos: [],
            medicamentos: [],
            medicamento: null,
            relacionesTecnovigilancia: ["Dispositivos", "Equipo biomédico", "Ambos"],
            loading: {
                sucesos: false,
                tipo_eventos: false,
                clasif_areas: false,
                operadores: false
            },
            serviciosOcurrencias: [
                'Hospitalización tercer piso', 'Hospitalización cuarto piso', 'Hospitalización quinto piso',
                'Hospitalización sexto piso',
                'Unidad de cuidados intensivos (UCI)', 'Unidad de cuidados especiales (UCE)', 'Cirugía', 'Endoscopia',
                'Urgencias',
                'Servicio farmacéutico', 'Laboratorio', 'Alimentación', 'Centro regulador', 'Quimioterapia',
                'Diagnóstico cardiovascular', 'Imagenología', 'Vacunación', 'Consulta externa', 'Hospitalización parcial'
            ],
            rep: null,
            repReporta: null,
            mostrarClasificacionArea: false,
            mostrarTipoEvento: false

        };
    },

    watch: {

        medicamento(val) {
            if (!val || val?.length < 4) {
                this.medicamentos = null;
            } if (val?.length === 4) {
                this.listarMedicamentos();
            }
        },

        rep(val) {
            if (!val || val?.length < 6) {
                this.reps = null;
            } if (val?.length === 6) {
                this.listarReps(val, 'reps');
            }
        },
        repReporta(val) {
            if (!val || val?.length < 6) {
                this.repsReporta = null;
            } if (val?.length === 6) {
                this.listarReps(val, 'repsReporta');
            }
        }
    },

    computed: {
        nombreAfiliadoEvento() {
            const a = this.eventoAdverso.afiliado || {};
            return `${a.primer_nombre || ''} ${a.segundo_nombre || ''} ${a.primer_apellido || ''} ${a.segundo_apellido || ''}`.trim();
        },
        fechaCreacion() {
            return this.eventoAdverso?.created_at?.substring(0, 10)
        }
    },

    methods: {
        ...mapActions("app", ["setPreload"]),
        listarEmpleadosAsignados() {
            this.$axios.get('/evento-asignado/' + this.eventoAdverso?.id).then(res => {
                this.usuariosAsignados = res.data
            }).catch(e => {
                console.log(e.response.data);
            })
        },
        listarSucesos() {
            this.loading.sucesos = true;
            this.$axios.get("/sucesos/listar").then((res) => {
                this.sucesos = res.data.data;
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                this.loading.sucesos = false;
            })
        },

        listarTiposEventos() {
            this.loading.tipo_eventos = true;
            if (!this.eventoAdverso.clasificacion_area_id) {
                this.tiposEventos = [];
                this.mostrarTipoEvento = false;
                return;
            }
            this.$axios.get(`/tipos-eventos/${this.eventoAdverso.clasificacion_area_id}`).then((res) => {
                this.tiposEventos = res.data.data;
                this.mostrarTipoEvento = this.tiposEventos.length > 0;
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                this.loading.tipo_eventos = false;
            })
        },

        listarClasiAreas() {
            this.loading.clasif_areas = true;
            if (!this.eventoAdverso.suceso_id) {
                this.clasifAreas = [];
                this.mostrarClasificacionArea = false;
                return;
            }
            this.$axios.get(`/clasificaciones-areas/${this.eventoAdverso.suceso_id}`).then((res) => {
                this.clasifAreas = res.data.data;
                this.mostrarClasificacionArea = this.clasifAreas.length > 0;
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                this.loading.clasif_areas = false;
            })
        },
        resetEventoClasificacion() {
            this.eventoAdverso.clasificacion_area_id = null;
            this.eventoAdverso.relacion = null;
        },
        listarReps(valor, tipo) {
            this.setPreload(true)
            this.$axios
                .post("reps/listarConfiltro?page=0", {
                    rep: valor
                })
                .then((res) => {
                    this[tipo] = res.data.map((rep) => ({
                        id: rep.id,
                        nombre: rep.nombre
                    }))
                })
                .finally(() => {
                    this.setPreload(false)
                });
        },
        actualizarEvento() {
            this.limpiarError()
            this.$axios.put('/eventos-adversos/' + this.eventoAdverso.id, this.eventoAdverso).then(res => {
                this.listarEmpleadosAsignados();
                this.$toast.success('Evento actualizado exitosamente!.');
            }).catch((error) => {
                if (error.response.data.mensaje) {
                    this.$toast.error(error.response.data.mensaje);
                } else if (error.response.data) {
                    this.handleErrors(error.response.data);
                }
            })
        },

        handleErrors(errors) {
            for (const key in this.errors) {
                if (key in errors) {
                    this.errors[key] = errors[key].join(",");
                }
            }
        },
        limpiarError() {
            for (const key in this.errors) {
                this.errors[key] = "";
            }
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
        listarOperadores() {
            this.loading.operadores = true
            this.$axios.get("/operador/listarActivos").then((res) => {
                this.listaOperadores = res.data;
            }).catch((error) => {
                this.$toast.error(error.response.data.mensaje);
            }).finally(() => {
                this.loading.operadores = false
            })
        },

        listarSedesReporte() {
            this.rep = this.eventoAdverso.sede_reporta?.nombre.slice(0, 5)
            this.listarReps(this.eventoAdverso.sede_reporta?.nombre, 'repsReporta');
            this.listarReps(this.eventoAdverso.sede_ocurrencia?.nombre, 'reps');
            if (this.eventoAdverso.dipositivo) {
                this.medicamento = this.eventoAdverso.dipositivo?.nombre
                this.listarMedicamentos(this.eventoAdverso.dipositivo?.nombre);
            }
        },

        resetClasificacionArea() {
            this.eventoAdverso.tipo_evento_id = null;
            this.tiposEventos = [];
            this.mostrarTipoEvento = false;
        },

        listarMedicamentos() {
            this.setPreload(true);
            this.$axios.post("/medicamentos/listarVademecum", {
                nombre: this.medicamento
            }).then((res) => {
                this.medicamentos = res.data.map((med) => ({
                    id: med.codesumi.id,
                    nombre: `${med.codesumi.nombre}`
                }));
            }).finally(() => {
                this.setPreload(false);
            })
        },
    },
};

</script>
