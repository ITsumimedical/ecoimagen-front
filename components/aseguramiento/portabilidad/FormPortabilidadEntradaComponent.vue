<template>
    <div>
        <template>
            <div class="text-center">
                <v-dialog v-model="preload_entrada" persistent width="300">
                    <v-card color="primary" dark>
                        <v-card-text>
                            Tranquilo procesamos tu solicitud !
                            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </div>
        </template>
        <v-card>
            <v-form ref="form">
                <v-alert dense text outlined color="blue" class="pa-4" icon="mdi-clipboard-text">
                    <b>Crear Portabilidad Entrada</b>
                </v-alert>
                <v-container fluid>
                    <v-row>
                        <v-col cols="12" sm="12" md="4">
                            <v-text-field outlined dense v-model="numero_documento" append-icon="mdi-magnify" clearable
                                @click:clear="limpiarNumeroDocumento()" label="Número Documento" type="number"
                                @click:append="buscarAfiliado()">
                            </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="5">
                            <v-btn @click="buscarAfiliado()" small dark color="info">Buscar</v-btn>
                            <v-btn color="error" @click="$emit('respuestaComponente')" small> Cerrar </v-btn>
                        </v-col>
                        <v-col cols="9" sm="9" md="12" v-if="datosAfiliado">
                            <AfiliadoComponent :afiliado="datosAfiliado" :modoDetalle="true" :modoEdicion="true"
                                :mostrarClasificaciones="true" @respuestaComponente="componente = null" />
                        </v-col>
                        <v-col cols="12" sm="12" md="12" v-if="datosAfiliado">
                            <v-alert type="info" text outlined dense class="text-center">
                                <b>Datos Portabilidad</b>
                            </v-alert>
                            <v-row>
                                <v-col cols="12" sm="12" md="3">
                                    <v-autocomplete label="IPS origen portabilidad" outlined dense :items="ips"
                                        v-model="portabilidadEntrada.origen_ips" :error-messages="errors.origen_ips">
                                    </v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="3">
                                    <v-text-field label="Telefono IPS portabilidad" outlined dense
                                        v-model="portabilidadEntrada.telefono_ips" type="number"
                                        :error-messages="errors.telefono_ips">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="3">
                                    <v-text-field label="Correo IPS portabilidad" outlined dense
                                        :rules="[rules.required, rules.correo_ips]"
                                        v-model="portabilidadEntrada.correo_ips">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="3">
                                    <v-text-field label="Fecha Inicio portabilidad" outlined dense type="date"
                                        v-model="portabilidadEntrada.fecha_inicio"
                                        :error-messages="errors.fecha_inicio">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="3">
                                    <v-text-field label="Cantidad dias" outlined dense
                                        v-model="portabilidadEntrada.cantidad_dias" type="number"
                                        @change="calcularFechaFinal" :error-messages="errors.cantidad_dias"
                                        hint="La cantidad debe tener un rango entre 15 y 180 días">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="3">
                                    <v-text-field label="Fecha Final portabilidad" outlined dense type="date"
                                        v-model="portabilidadEntrada.fecha_final" disabled
                                        :error-messages="errors.fecha_final">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                    <v-file-input v-model="files" color="deep-purple accent-4" counter
                                        label="Cargue de Archivos" multiple placeholder="Seleccione los Archivos"
                                        prepend-icon="mdi-paperclip" :show-size="1000" dense accept=".pdf">
                                        <template v-slot:selection="{ index, text }">
                                            <v-chip v-if="index < 2" color="warning" dark label small>
                                                {{ text }}
                                            </v-chip>
                                            <span v-else-if="index === 2"
                                                class="text-overline grey--text text--darken-3 mx-2">
                                                +{{ files.length - 2 }} File(s)
                                            </span>
                                        </template>
                                    </v-file-input>
                                </v-col>
                            </v-row>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="success" small @click="crearPortabilidadEntrada()">
                                    Guardar
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>

            <v-dialog v-model="historialPortabilidadEntrada" max-width="1000" persistent>
                <v-card>
                    <v-alert dense text outlined color="blue" class="text-center" icon="mdi-history">
                        <b>Historial Portabilidad Entrada</b>
                    </v-alert>
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="buscar" append-icon="mdi-magnify" label="Buscar..." single-line
                            hide-details>
                        </v-text-field>
                    </v-col>
                    <v-col>
                        <v-data-table :headers="historialEntrada" :items="historial" item-key="id" class="elevation-1"
                            :search="buscar">
                            <template v-slot:items="props">
                                <tr>
                                    <td>{{ props.item.portabilidad_entrada.fecha_inicio }}</td>
                                    <td>{{ props.item.portabilidad_entrada.cantidad_dias }}</td>
                                    <td>{{ props.item.portabilidad_entrada.fecha_final }}</td>
                                    <td>{{ props.item.portabilidad_entrada.ips_origen }}</td>
                                </tr>
                            </template>
                            <template v-slot:[`item.estado`]="{ item }">
                                <tr>
                                    <td>
                                        <v-chip :color="colorEstado(item.estado_id)" outlined>
                                            {{ item.estado }}
                                        </v-chip>
                                    </td>
                                </tr>
                            </template>
                        </v-data-table>
                    </v-col>
                    <v-card-actions class="justify-end">
                        <v-btn color="red" @click="historialPortabilidadEntrada = false" small dark>Cerrar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

        </v-card>
    </div>
</template>

<script>
import AfiliadoComponent from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import {
    buscarAfiliado
} from "@/api/afiliados/afiliados";
export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('blog.vista')) {
            return redirect('/');
        }
    },
    components: {
        AfiliadoComponent,
    },

    data() {
        return {
            numero_documento: [],
            datosAfiliado: '',
            datosBasicos: false,
            editar: false,
            preload_entrada: false,
            historial: [],
            buscar: '',
            historialPortabilidadEntrada: false,
            files: [],
            rules: {
                required: value => !!value || 'Campo Correo es requerido.',
                correo_ips: value => {
                    const pattern =
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || '¡Correo invalido!'
                },
            },
            ips: [
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
            portabilidadEntrada: {
                origen_ips: '',
                telefono_ips: '',
                correo_ips: '',
                fecha_inicio: '',
                cantidad_dias: '',
                fecha_final: ''
            },
            errors: {
                origen_ips: '',
                telefono_ips: '',
                correo_ips: '',
                fecha_inicio: '',
                cantidad_dias: '',
                fecha_final: ''
            },
            historialEntrada: [{
                text: 'Fecha inicial',
                value: 'portabilidad_entrada.fecha_inicio'
            },
            {
                text: 'Cantidad Dias',
                value: 'portabilidad_entrada.cantidad_dias'
            },
            {
                text: 'Fecha Final',
                value: 'portabilidad_entrada.fecha_final'
            },
            {
                text: 'IPS Origen',
                value: 'portabilidad_entrada.origen_ips'
            },
            {
                text: 'Estado',
                value: 'estado'
            }
            ]
        }
    },

    methods: {

        buscarAfiliado() {
            this.preload_entrada = true;
            this.$axios.get('afiliados/' + this.numero_documento)
                .then(res => {
                    this.verificarPortabilidadesActivas(res.data.id)
                        .then(tienePortabilidadesActivas => {
                            if (!tienePortabilidadesActivas) {
                                this.datosAfiliado = res.data;
                                this.editar = true;
                                this.datosBasicos = true;
                                this.preload_entrada = false;
                            }
                            this.consultarHistorial(this.numero_documento);
                            this.preload_entrada = false;
                        })
                        .catch(error => {
                            console.error('Error al verificar portabilidades activas:', error);
                            this.preload_entrada = false;
                        });
                })
                .catch(e => {
                    this.$toast.error('El afiliado no se encuentra en la base de datos');
                    this.preload_entrada = false;
                });
        },

        verificarPortabilidadesActivas(afiliadoId) {
            return new Promise((resolve, reject) => {
                this.$axios.post(`/portabilidad-entrada/portabilidades-activas/${afiliadoId}`)
                    .then(res => {
                        const tienePortabilidadesActivas = res.data.portabilidades_activas;

                        if (tienePortabilidadesActivas) {
                            this.$toast.error('El afiliado tiene portabilidades activas');
                            resolve(true);
                        } else {
                            console.log('El afiliado no tiene portabilidades activas');
                            resolve(false);
                        }
                    })
                    .catch(error => {
                        this.$toast.error('Error al verificar portabilidades activas');
                        reject(error);
                    });
            });
        },

        consultarHistorial(numero_cedula) {
            this.preload_entrada = true;
            this.$axios.get(`/portabilidad-entrada/historial/${numero_cedula}`)
                .then(res => {
                    console.log('historial', res.data);
                    this.historialPortabilidadEntrada = true;
                    this.historial = res.data.data;
                    this.preload_entrada = false;
                })
                .catch(e => {
                    this.$toast.error('No se pudo obtener el historial de portabilidad.');
                    this.preload_entrada = false;
                });
        },

        crearPortabilidadEntrada() {
            if (this.files.length <= 0) {
                return this.$swal({
                    title: "¡Error!",
                    text: "Debe adjuntar mínimo un archivo.",
                    type: "warning",
                });
            }
            const formData = new FormData();
            formData.append(`afiliado_id`, this.datosAfiliado.id);
            formData.append(`primer_nombre`, this.datosAfiliado.primer_nombre);
            formData.append(`segundo_nombre`, this.datosAfiliado.segundo_nombre);
            formData.append(`primer_apellido`, this.datosAfiliado.primer_apellido);
            formData.append(`segundo_apellido`, this.datosAfiliado.segundo_apellido);
            formData.append(`tipo_documento`, this.datosAfiliado.tipo_documento);
            formData.append(`documento_afiliado`, this.datosAfiliado.numero_documento);
            formData.append(`region`, this.datosAfiliado.region);
            formData.append(`sexo`, this.datosAfiliado.sexo);
            formData.append(`fecha_nacimiento`, this.datosAfiliado.fecha_nacimiento);
            formData.append(`fecha_afiliacion`, this.datosAfiliado.fecha_afiliacion);
            formData.append(`tipo_afiliacion_id`, this.datosAfiliado.tipo_afiliacion_id);
            formData.append(`estado_afiliacion_id`, this.datosAfiliado.estado_afiliacion_id);
            formData.append(`ips`, this.datosAfiliado.ips);
            formData.append(`parentesco`, this.datosAfiliado.parentesco);
            formData.append(`tipo_documento_cotizante`, this.datosAfiliado.tipo_documento_cotizante);
            formData.append(`numero_documento_cotizante`, this.datosAfiliado.numero_documento_cotizante);
            formData.append(`tipo_cotizante`, this.datosAfiliado.tipo_cotizante);
            formData.append(`origen_ips`, this.portabilidadEntrada.origen_ips);
            formData.append(`telefono_ips`, this.portabilidadEntrada.telefono_ips);
            formData.append(`correo_ips`, this.portabilidadEntrada.correo_ips);
            formData.append(`fecha_inicio`, this.portabilidadEntrada.fecha_inicio);
            formData.append(`fecha_final`, this.portabilidadEntrada.fecha_final);
            formData.append(`cantidad_dias`, this.portabilidadEntrada.cantidad_dias);
            // Agregar los archivos adjuntos
            for (let i = 0; i < this.files.length; i++) {
                formData.append(`adjuntos[]`, this.files[i]);
            }
            this.preload_entrada = true;
            this.$axios
                .post("/portabilidad-entrada/crear", formData)
                .then((res) => {
                    this.$toast.success(res.data.mensaje);
                    this.preload_entrada = false;
                    this.$emit('respuestaComponente');
                    this.limpiarDatos();
                })
                .catch((error) => {
                    this.preload_entrada = false;
                    if (error.response.data.mensaje) {
                        this.$toast.error(error.response.data.mensaje);
                    } else if (error.response.data) {
                        this.Error(error.response.data);
                    }
                });
        },

        calcularFechaFinal() {
            if (this.portabilidadEntrada.fecha_inicio && this.portabilidadEntrada.cantidad_dias) {
                const fechaInicio = new Date(this.portabilidadEntrada.fecha_inicio);
                const cantidadDias = parseInt(this.portabilidadEntrada.cantidad_dias);
                const fechaFinal = new Date(fechaInicio.getTime() + cantidadDias * 24 * 60 * 60 * 1000);
                this.portabilidadEntrada.fecha_final = fechaFinal.toISOString().slice(0, 10);
            }
        },

        limpiarDatos() {
            for (const key in this.portabilidad) {
                this.portabilidad[key] = "";
            }
            this.files = []
        },

        Error(errors) {
            for (const key in this.errors) {
                if (key in errors) {
                    this.errors[key] = errors[key].join(",");
                }
            }
        },

        async listarPortabilidadSalida() {
            this.loading = true
            try {
                const {
                    data
                } = await this.$loadingGetRequest(listarPortabilidadSalida(this.paginate.page))
                this.listaPortabilidad = data.data
                this.paginate.total = data.data.last_page
                this.paginate.page = data.data.current_page
                this.loading = false
            } catch (error) {
                this.loading = false

            }
        },

        limpiarNumeroDocumento() {
            for (const key in this.form) {
                this.form[key] = "";
            }
        },

        colorEstado(estado_id) {
            if (estado_id == 1) {
                return 'success';
            } else {
                return 'error';
            }
        },
    },
}

</script>
