<template>
    <div>
        <v-card>
            <v-form ref="form">
                <v-alert dense text outlined color="blue" class="pa-4" icon="mdi-clipboard-text">
                    <b>Crear Portabilidad Salida</b>
                </v-alert>

                <v-container fluid>
                    <v-row>
                        <!-- <v-col cols="12" sm="6" md="4">
                <v-text-field  dense v-model="numero_documento" v-on:keyup.enter="buscarAfiliado" clearable
                  hide-spin-buttons @click:clear="limpiarNumeroDocumento()" label="Numero Documento" type="number"
                  @click:append="buscarAfiliado" :error-messages="errors.numero_documento" outlined>
                </v-text-field>
              </v-col> -->
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
                    </v-row>
                    <v-col cols="9" sm="9" md="12" v-if="datosPaciente">
                        <AfiliadoComponent :afiliado="datosPaciente" :modoDetalle="true" :modoEdicion="true"
                            :mostrarClasificaciones="true" @respuestaComponente="componente = null" />
                    </v-col>
                    <v-col cols="12" sm="12" md="12" v-if="datosPaciente">
                        <v-alert type="info" text outlined dense class="text-center">
                            <b>Datos Portabilidad</b>
                        </v-alert>
                        <v-row>
                            <v-col cols="12" sm="6" md="3">
                                <v-autocomplete :items="departamento" item-text="nombre" item-value="id"
                                    v-model="portabilidad.departamento_atencion" label="Departamento Receptor"
                                    @change="listarMunicipios(portabilidad.departamento_atencion)"
                                    :error-messages="errors.departamento_atencion" dense>
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-autocomplete :items="municipio" item-text="nombre" item-value="id"
                                    @change="getReps(portabilidad.municipio_atencion)"
                                    v-model="portabilidad.municipio_atencion" label="Municipio Receptor"
                                    :error-messages="errors.municipio_atencion" dense></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-autocomplete :items="ut" v-model="portabilidad.entidad" label="Entidad Receptora"
                                    :error-messages="errors.entidad" dense>
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field v-model="portabilidad.fechaInicio_portabilidad"
                                    label="Fecha inicial Portabilidad" type="date"
                                    :error-messages="errors.fechaInicio_portabilidad" dense></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field type="number" v-model="portabilidad.cantidad" label="Cantidad"
                                    :error-messages="errors.cantidad" dense @change="calcularFechaFinal"
                                    hint="La cantidad debe tener un rango entre 15 y 180 días"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field v-model="portabilidad.fechaFinal_portabilidad"
                                    label="Fecha Final Portabilidad" type="date"
                                    :error-messages="errors.fechaFinal_portabilidad" disabled dense></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-autocomplete :items="Motivo" v-model="portabilidad.Motivo" label="Motivo"
                                    :error-messages="errors.Motivo" dense></v-autocomplete>
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
                            <!-- guardar portabilidad -->
                            <v-btn :disabled="!valid" color="success" @click="GuardarPortabilidadSalida()" small>
                                Guardar
                            </v-btn>
                        </v-card-actions>
                    </v-col>
                </v-container>
            </v-form>
        </v-card>

        <!-- <v-dialog v-model="HistorialPortabilidadSalida" max-width="1000" persistent>
          <v-card>
            <v-card-title>
              <v-col cols="12" sm="12" md="12">
                <v-alert dense text outlined color="blue" class="text-center" icon="mdi-history"><b>Historial
                    Portabilidad Salida</b></v-alert>
              </v-col>
            </v-card-title>
            <v-card-text>
              <v-expansion-panels>
                <v-expansion-panel v-for="(item, index) in historial" :key="index">
                  <v-expansion-panel-header>
                    <v-col>
                      <span><b>Fecha Inicio:</b> {{ item.portabilidad_salida.fecha_inicio }}</span>
                    </v-col>
                    <v-col>
                      <span><b>Fecha Final:</b> {{ item.portabilidad_salida.fecha_final }}</span>
                    </v-col>
                    <v-col>
                      <span><b>IPS destino:</b> {{ item.portabilidad_salida.destino_ips }}</span>
                    </v-col>
                  </v-expansion-panel-header>

                </v-expansion-panel>
              </v-expansion-panels>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success"
                  @click.prevent="mostrarProcesoRegistro = true, HistorialPortabilidadSalida = false, validation = false" small>
                  Aceptar
                </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-dialog> -->

        <v-dialog v-model="HistorialPortabilidadSalida" max-width="1000" persistent>
            <v-card>
                <v-alert dense text outlined color="blue" class="text-center" icon="mdi-history">
                    <b>Historial Portabilidad Salida</b>
                </v-alert>
                <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="buscar" append-icon="mdi-magnify" label="Buscar..." single-line hide-details>
                    </v-text-field>
                </v-col>
                <v-col>
                    <v-data-table :headers="portabilidadSalida" :items="historial" item-key="id" class="elevation-1"
                        :search="buscar">
                        <template v-slot:items="props">
                            <tr>
                                <td>{{ props.item.portabilidad_salida.fecha_inicio }}</td>
                                <td>{{ props.item.portabilidad_salida.fecha_final }}</td>
                                <td>{{ props.item.portabilidad_salida.destino_ips }}</td>
                                <td>{{ props.item.portabilidad_salida.cantidad }}</td>
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
                    <v-btn color="red" @click="HistorialPortabilidadSalida = false" small dark>Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <!-- preload -->
        <template>
            <div class="text-center">
                <v-dialog v-model="preload_salida" persistent width="300">
                    <v-card color="primary" dark>
                        <v-card-text>
                            Tranquilo procesamos tu solicitud !
                            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </div>
        </template>
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
            datos: {},
            datosPaciente: '',
            preload_salida: false,
            valid: true,
            datosBasicos: false,
            buscar: null,
            editar: false,
            HistorialPortabilidadSalida: false,
            historial: [],
            reps: [],
            files: [],
            portabilidad: {
                id: null,
                numero_documento: null,
                primer_nombre: null,
                segundo_nombre: null,
                primer_apellido: null,
                segundo_apellido: null,
                region: null,
                entidad: null,
                sexo: null,
                fecha_nacimiento: null,
                fecha_afiliacion: null,
                tipo_afiliacion: null,
                estado_afiliado: null,
                ips_primaria: null,
                parentesco: null,
                tipo_documento_cotizante: null,
                numero_documento_cotizante: null,
                tipo_cotizante: null,
                tipo_documento: null,
                departamento_afiliacion: null,
                dane_departamento: null,
                municipio_afiliacion: null,
                dane_municipio: null,
                subregion: null,
                departamento_atencion: null,
                municipio_atencion: null,
                ips: null,
                sede_odontologica: null,
                Direccion_Residencia_calle: null,
                Direccion_Residencia_numero_exterior: null,
                Direccion_Residencia_numero_interior: null,
                Direccion_Residencia_interior: null,
                Direccion_Residencia_barrio: null,
                Mpio_Residencia: null,
                Telefono: null,
                Celular1: null,
                Celular2: null,
                Correo1: null,
                Correo2: null,
                Medicofamilia: null,
                Etnia: null,
                entidad_id: null,
                ipsorigen_portabilidad: null,
                telefonoorigen_portabilidad: null,
                correoorigen_portabilidad: null,
                correoorigen_portabilidad: null,
                fechaFinal_portabilidad: null,
                fechaInicio_portabilidad: null,
                cantidad: null,
            },
            errors: {
                numero_documento: null,
                primer_nombre: null,
                segundo_nombre: null,
                primer_apellido: null,
                segundo_apellido: null,
                region: null,
                entidad: null,
                sexo: null,
                fecha_nacimiento: null,
                fecha_afiliacion: null,
                tipo_afiliacion: null,
                estado_afiliado: null,
                ips_primaria: null,
                parentesco: null,
                tipo_documento_cotizante: null,
                numero_documento_cotizante: null,
                tipo_cotizante: null,
                tipo_documento: null,
                departamento_afiliacion: null,
                dane_departamento: null,
                municipio_afiliacion: null,
                dane_municipio: null,
                subregion: null,
                departamento_atencion: null,
                municipio_atencion: null,
                ips: null,
                sede_odontologica: null,
                Direccion_Residencia_calle: null,
                Direccion_Residencia_numero_exterior: null,
                Direccion_Residencia_numero_interior: null,
                Direccion_Residencia_interior: null,
                Direccion_Residencia_barrio: null,
                Mpio_Residencia: null,
                Telefono: null,
                Celular1: null,
                Celular2: null,
                Correo1: null,
                Correo2: null,
                Medicofamilia: null,
                Etnia: null,
                entidad_id: null,
                ipsorigen_portabilidad: null,
                telefonoorigen_portabilidad: null,
                correoorigen_portabilidad: null,
                correoorigen_portabilidad: null,
                fechaFinal_portabilidad: null,
                fechaInicio_portabilidad: null,
                Motivo: null,
                cantidad: null,
            },
            numero_documento: [],
            portabilidadSalida: [{
                text: 'Fecha Inicial',
                align: 'start',
                sortable: false,
                value: 'portabilidad_salida.fecha_inicio',
            },
            {
                text: 'Cantidad',
                align: 'start',
                sortable: false,
                value: 'portabilidad_salida.cantidad',
            },
            {
                text: 'Fecha Final',
                align: 'start',
                sortable: false,
                value: 'portabilidad_salida.fecha_final',
            },
            {
                text: 'Ips Destino',
                align: 'start',
                sortable: false,
                value: 'portabilidad_salida.destino_ips',
            },
            {
                text: 'Estado',
                align: 'start',
                sortable: false,
                value: 'estado',
            }
            ],
            headers: [{
                text: 'id Paciente',
                align: 'start',
                sortable: false,
                value: 'id',
            },
            {
                text: 'Tipo Documento',
                value: 'codigo'
            },
            {
                text: 'Documento',
                value: 'nombre'
            },
            {
                text: 'Afiliado',
                value: 'nit'
            },
            {
                text: 'Ut',
                value: 'direccion'
            },
            {
                text: 'Fecha Inicial',
                value: 'email_1'
            },
            {
                text: 'Fecha Final',
                value: 'email_1'
            },
            {
                text: 'Ips Portabilidad',
                value: 'capitado'
            },
            {
                text: 'Acciones',
                value: 'actions',
                sortable: false
            },
            ],
            regiones: ['Región 1', 'Región 2', 'Región 3', 'Región 4', 'Región 5', 'Región 6', 'Región 7', 'Región 8',
                'Región 9', 'Región 10'
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
                "UNIÓN TEMPORAL SERVISALUD SAN JOSÉ",
            ],
            tipoDocumento: ["RC", "TI", "CC", "CE", "PA", "CN", "PE", "SA"],
            sexo: ['M', 'F'],
            parentesco: ['Padre o Madre', 'Hijo Docente', 'NO APLICA', 'Conyuge o Compañero', 'Hijo Conyuge',
                'Hijo Adoptivo', 'Hijo Discapacitado', 'Otro', 'Nieto menor o igual a 30 días'
            ],
            TipoCotizante: ['Cotizante docente', 'Cotizante Fallecido', 'Cotizante Pensionado', 'Beneficiario',
                'Sustituto Pensional'
            ],
            TipoAfiliado: ['BENEFICIARIO', 'COTIZANTE', 'Cotizante Fallecido', 'Sustituto Pensional',
                'Cotizante Pensionado', 'Cotizante Dependiente'
            ],
            estados: ['Activo', 'Retirado', 'Protección Laboral Cotizante', 'Protección Laboral Beneficiario'],
            discapacidad: ['Sin discapacidad', 'Mental/psíquica', 'Física', 'Auditiva', 'Visual',
                'Sordo - Ceguera'
            ],
            subregion: ['Nordeste', 'Suroeste', 'Occidente', 'Valle de Aburra', 'Magdalena Medio', 'Norte',
                'Oriente', 'Urabá', 'Bajo Cauca', 'PuertosNacionales', 'PtosSantander', 'PtosAntioquia',
                'Santanderes', 'Antioquia'
            ],
            gradoDiscapacidad: ['Moderada', 'Leve', 'Severa'],
            sedeOdontologia: ['SUMIMEDICAL QUIBDO', 'SUMIMEDICAL S.A.S SEDE APARTADO', 'SUMIMEDICAL S.A.S SEDE BELLO',
                'SUMIMEDICAL S.A.S SEDE CAUCASIA', 'SUMIMEDICAL S.A.S SEDE COPACABANA',
                'SUMIMEDICAL S.A.S SEDE ENVIGADO', 'SUMIMEDICAL S.A.S SEDE ESTADIO',
                'SUMIMEDICAL S.A.S SEDE ITAGUI', 'SUMIMEDICAL S.A.S SEDE PUERTO BERRIO',
                'SUMIMEDICAL S.A.S SEDE RIONEGRO', 'SUMIMEDICAL S.A.S SEDE TURBO',
                'SUMIMEDICAL S.A.S SEDE VILLANUEVA', 'SUMIMEDICAL SEDE BOLIVIA', 'SUMIMEDICAL SEDE CALDAS',
                'SUMIMEDICAL SEDE CHIGORODO', 'NO APLICA'
            ],
            municipio: [],
            municipios: [],
            departamento: [],
            departamentoCodigo: [],
            Motivo: ['Comisión de Estudios', 'Vacaciones', 'Licencia de Maternidad', 'Razones Familiares', 'Otro'],

        };
    },

    created() {
        this.listarDepartamentos();
    },

    methods: {

        /**
         * cerrar modal
         * @author kobatime
         */
        cerrar() {
            this.dialogo = false
            this.limpiarDatos()
            this.limpiarError()
        },

        /**
         * Abrir modal
         * @param abrir boolean
         * @author kobatime
         */
        abrilModalSalida(abrir) {
            if (abrir == true) {

            } else {
                this.dialogo = true
            }
        },

        buscarAfiliado() {
            this.preload_salida = true;
            this.$axios.get('afiliados/' + this.numero_documento)
                .then(res => {
                    // Verificar si el afiliado tiene portabilidades activas
                    this.verificarPortabilidadesActivas(res.data.id)
                        .then(tienePortabilidadesActivas => {
                            if (!tienePortabilidadesActivas) {
                                this.datosPaciente = res.data;
                                this.editar = true;
                                this.datosBasicos = true;
                            }
                            // Llamar a la función para consultar el historial independientemente de las portabilidades activas
                            this.consultarHistorial(this.numero_documento);
                            this.preload_salida = false;
                        })
                        .catch(error => {
                            console.error('Error al verificar portabilidades activas:', error);
                            this.preload_salida = false;
                        });
                })
                .catch(e => {
                    this.$toast.error('El afiliado no se encuentra en la base de datos');
                    this.preload_salida = false;
                });
        },

        verificarPortabilidadesActivas(afiliadoId) {
            return new Promise((resolve, reject) => {
                this.$axios.post(`/portabilidad-salida/verificar-portabilidades-activas/${afiliadoId}`)
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

        limpiarNumeroDocumento() {
            for (const key in this.form) {
                this.form[key] = "";
            }
        },

        /**
         * listar portabilidadades
         * @param paginate.page number
         * @return listarportabilidad objeto
         * @author kobatime
         */
        async listarPortabilidadEntrada() {
            this.loading = true
            try {
                const {
                    data
                } = await this.$loadingGetRequest(listarPortabilidadEntrada(this.paginate.page))
                this.listaPortabilidad = data.data
                this.paginate.total = data.data.last_page
                this.paginate.page = data.data.current_page
                this.loading = false
            } catch (error) {
                this.loading = false

            }
        },

        /**
         * listar municipio con filer de departamento
         * @param data number
         * @return municipio objeto
         * @author kobatime
         */
        listarMunicipios(data) {
            return this.departamento
                .filter((item) => item.id == data)
                .map((municipios) => {
                    return (this.municipio = municipios.municipios);
                });
        },

        /**
         * listar departamentos
         * @return departamento objeto
         * @author kobatime
         */
        listarDepartamentos() {
            this.$axios.get('/departamento/').then(res => {
                this.departamento = res.data
            }).catch(error => {
                console.log(error)
            })
        },

        /**
         * Guardar portabilidad
         * @param portabilidad objeto
         * @author kobatime
         */
        GuardarPortabilidadSalida() {
            if (!this.datosPaciente) {
                return this.$swal({
                    title: "¡Error!",
                    text: "Debe buscar y seleccionar un afiliado antes de guardar la portabilidad.",
                    type: "warning",
                });
            }

            if (this.files.length <= 0) {
                return this.$swal({
                    title: "¡Error!",
                    text: "Debe adjuntar mínimo un archivo.",
                    type: "warning",
                });
            }

            // Crear un objeto FormData para enviar los datos y archivos
            const formData = new FormData();
            this.portabilidad.afiliado_id = this.datosPaciente.id;
            // Agregar los datos del afiliado seleccionado
            formData.append(`afiliado_id`, this.datosPaciente.id);
            formData.append(`primer_nombre`, this.datosPaciente.primer_nombre);
            formData.append(`segundo_nombre`, this.datosPaciente.segundo_nombre);
            formData.append(`primer_apellido`, this.datosPaciente.primer_apellido);
            formData.append(`segundo_apellido`, this.datosPaciente.segundo_apellido);
            formData.append(`tipo_documento`, this.datosPaciente.tipo_documento);
            formData.append(`numero_documento`, this.datosPaciente.numero_documento);
            formData.append(`region`, this.datosPaciente.region);
            formData.append(`sexo`, this.datosPaciente.sexo);
            formData.append(`fecha_nacimiento`, this.datosPaciente.fecha_nacimiento);
            formData.append(`fecha_afiliacion`, this.datosPaciente.fecha_afiliacion);
            formData.append(`tipo_afiliacion_id`, this.datosPaciente.tipo_afiliacion_id);
            formData.append(`estado_afiliacion_id`, this.datosPaciente.estado_afiliacion_id);
            formData.append(`ips`, this.datosPaciente.ips);
            formData.append(`parentesco`, this.datosPaciente.parentesco);
            formData.append(`tipo_documento_cotizante`, this.datosPaciente.tipo_documento_cotizante);
            formData.append(`numero_documento_cotizante`, this.datosPaciente.numero_documento_cotizante);
            formData.append(`tipo_cotizante`, this.datosPaciente.tipo_cotizante);
            formData.append(`departamento_atencion`, this.portabilidad.departamento_atencion);
            formData.append(`municipio_atencion`, this.portabilidad.municipio_atencion);
            formData.append(`entidad`, this.portabilidad.entidad);
            formData.append(`fechaInicio_portabilidad`, this.portabilidad.fechaInicio_portabilidad);
            formData.append(`fechaFinal_portabilidad`, this.portabilidad.fechaFinal_portabilidad);
            formData.append(`Motivo`, this.portabilidad.Motivo);
            formData.append(`cantidad`, this.portabilidad.cantidad);

            // Agregar los archivos adjuntos
            for (let i = 0; i < this.files.length; i++) {
                formData.append(`adjuntos[]`, this.files[i]);
            }
            this.preload_salida = true;
            // Enviar la solicitud POST con los datos y archivos adjuntos
            this.$axios
                .post("/portabilidad-salida/crear", formData)
                .then((res) => {
                    this.$toast.success(res.data.mensaje);
                    this.preload_salida = false;
                    this.$emit('respuestaComponente');
                    this.limpiarDatos();
                })
                .catch((error) => {
                    this.preload_salida = false;
                    if (error.response.data.mensaje) {
                        this.$toast.error(error.response.data.mensaje);
                    } else if (error.response.data) {
                        this.Error(error.response.data);
                    }
                });
        },

        calcularFechaFinal() {
            if (this.portabilidad.fechaInicio_portabilidad && this.portabilidad.cantidad) {
                const fechaInicio = new Date(this.portabilidad.fechaInicio_portabilidad);
                const cantidadDias = parseInt(this.portabilidad.cantidad);
                const fechaFinal = new Date(fechaInicio.getTime() + cantidadDias * 24 * 60 * 60 * 1000);
                this.portabilidad.fechaFinal_portabilidad = fechaFinal.toISOString().slice(0, 10);
            }
        },

        /**
         * for de errores para los campos
         * @param error array
         * @return errors
         * @author kobatime
         */
        Error(errors) {
            for (const key in this.errors) {
                if (key in errors) {
                    this.errors[key] = errors[key].join(",");
                }
            }
        },



        limpiarDatos() {
            for (const key in this.portabilidad) {
                this.portabilidad[key] = "";
            }
            this.files = []
        },

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
            this.preload_salida = true
            this.$axios
                .post("/reps/listar", requets)
                .then((res) => {
                    this.reps = res.data;
                    this.preload_salida = false
                })
                .catch((error) => {
                    this.$toast.error("No se ha podido cargar los datos");
                });
        },
        consultarHistorial(numero_cedula) {
            this.preload_salida = true;
            this.$axios.get(`/portabilidad-salida/historial/${numero_cedula}`)
                .then(res => {
                    console.log('historial', res.data);
                    this.HistorialPortabilidadSalida = true;
                    this.historial = res.data.data;
                    this.preload_salida = false;
                })
                .catch(e => {
                    this.$toast.error('No se pudo obtener el historial de portabilidad.');
                    this.preload_salida = false;
                });
        },

        colorEstado(estado_id) {
            if (estado_id == 1) {
                return 'success';
            } else {
                return 'error';
            }
        },
    },
};

</script>
