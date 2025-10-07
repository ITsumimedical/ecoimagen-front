<template>
    <div>
        <v-dialog v-if="erroresPrevios.length > 0" v-model="dialogError" width="800">
            <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                    Errores Radicación
                </v-card-title>

                <v-card-text>
                    <template v-for="error in erroresPrevios">
                        <v-alert dense outlined type="error">{{ error.mensaje }}</v-alert>
                    </template>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" dark @click="dialogError = false">
                        Cerrar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-card>
            <v-alert class="text-center" type="info" icon="mdi-checkbox-marked-circle-plus-outline" dense text
                border="left">Módulo validador de <b>RIPS</b> con la resolución <b>2284</b> ó <b>3374</b></v-alert>
            <!-- <v-divider></v-divider> -->
            <v-row class="mx-2">
            <!-- <v-btn depressed color="success" @click="generarRIPS()">
                generar RIPS
            </v-btn> -->
                <v-col cols="12" sm="12" md="3">
                    <v-select :items="resolucion" dense outlined v-model="tipoResolucion" color="info"
                        label="Selecciona tipo resolución"></v-select>
                </v-col>
                <!-- <v-col cols="12" sm="12" md="3">
                    <v-btn color="success" v-show="$can('solo_calvarez_07')" @click="GenerarRipsHorus1()" block>Temporal migración</v-btn>
                </v-col> -->
            </v-row>
            <v-form ref="form" v-model="formvalid" lazy-validation>
                <v-row class="mx-2" v-if="tipoResolucion == '2284'">
                    <v-col cols="12" sm="12" md="4">
                        <v-file-input v-model="archivojson" dense color="success" counter label="Cargar Json"
                            placeholder="Select your files" prepend-icon="mdi-paperclip" outlined :show-size="1000"
                            required :rules="rule">
                            <template v-slot:selection="{ index, text }">
                                <v-chip v-if="index < 2" color="primary" dark label small>
                                    {{ text }}
                                </v-chip>
                                <span v-else-if="index === 2" class="text-overline grey--text text--darken-3 mx-2">
                                    +{{ archivojson.length - 2 }} File(s)
                                </span>
                            </template>
                        </v-file-input>
                    </v-col>

                    <v-col cols="12" sm="12" md="3">
                        <v-file-input v-model="archivoxml" dense color="success" counter label="Cargar XML"
                            placeholder="Select your files" prepend-icon="mdi-paperclip" outlined :show-size="1000"
                            required :rules="rule">
                            <template v-slot:selection="{ index, text }">
                                <v-chip v-if="index < 2" color="primary" dark label small>
                                    {{ text }}
                                </v-chip>
                                <span v-else-if="index === 2" class="text-overline grey--text text--darken-3 mx-2">
                                    +{{ archivoxml.length - 2 }} File(s)
                                </span>
                            </template>
                        </v-file-input>
                    </v-col>

                    <v-col cols="12" sm="12" md="3">
                        <v-file-input v-model="archivocuv" dense color="success" counter label="Cargar CUV"
                            placeholder="Select your files" prepend-icon="mdi-paperclip" outlined :show-size="1000"
                            required :rules="rule">
                            <template v-slot:selection="{ index, text }">
                                <v-chip v-if="index < 2" color="primary" dark label small>
                                    {{ text }}
                                </v-chip>
                                <span v-else-if="index === 2" class="text-overline grey--text text--darken-3 mx-2">
                                    +{{ archivocuv.length - 2 }} File(s)
                                </span>
                            </template>
                        </v-file-input>

                    </v-col>


                    <v-col cols="12" sm="12" md="7">
                        <v-file-input v-model="soporteFile" label="Carga de soporte radicación" :rules="rule" outlined
                            multiple dense>
                        </v-file-input>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                        <v-btn color="success" @click="GuardarRipsJson()" block>Registrar RIPS</v-btn>
                    </v-col>
                </v-row>
            </v-form>
            <v-row class="mx-2" v-if="tipoResolucion == '3374'">
                <v-col cols="12" sm="12" md="5">
                    <v-file-input accept="text/plain" counter multiple small-chips
                        label="Cargar Archivos Planos .TXT RIPS" truncate-length="30" outlined v-model="files" dense>
                        <template v-slot:counter={props}>
                            {{props.value.substr(0,1)}} Archivos
                        </template>
                    </v-file-input>
                </v-col>
                <v-col cols="12" sm="12" md="3">
                    <v-file-input v-model="soporteFile" label="Carga de soporte radicación" :rules="rule" outlined dense
                        multiple>
                    </v-file-input>
                </v-col>
                <v-col cols="12" sm="8" md="2">
                    <v-select :items="entidades" dense item-value="id" item-text="nombre" v-model="entidad" outlined
                        color="info" label="Entidad" autocomplete style="font-size: 13px;"></v-select>
                </v-col>
                <v-col cols="12" sm="2" md="2">
                    <v-btn small color="success" @click="valid">
                        Validar RIPS
                    </v-btn>
                </v-col>
                <v-spacer class="mt-3"></v-spacer>
                <v-col cols="12" sm="12" md="12">
                    <v-data-table no-data-text="Aún no hay registros" dense :headers="headers" :items="listaPaquetes"
                        item-key="name">
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon v-if="parseInt(item.estado_id) === 25 || parseInt(item.estado_id) === 27"
                                class="mr-2" color="orange" @click="descargarErrores(item.id)">
                                mdi-cloud-download
                            </v-icon>
                            <v-icon
                                v-if="parseInt(item.estado_id) === 25 || parseInt(item.estado_id) === 27 || parseInt(item.estado_id) === 28 || parseInt(item.estado_id) === 24"
                                color="error" @click="eliminarValidacion(item)">
                                mdi-delete-forever
                            </v-icon>
                        </template>
                        <template v-slot:[`item.estado_id`]="{ item }">
                            <v-chip small v-if="item.estado_id == 26" :color="colorEstado(item.estado_id)" dark>
                                {{ 'Validando Contenido' }}
                            </v-chip>
                            <v-chip small v-if="item.estado_id == 24" :color="colorEstado(item.estado_id)" dark>
                                {{ 'Validando Estructura' }}
                            </v-chip>
                            <v-chip small v-if="item.estado_id == 25" :color="colorEstado(item.estado_id)" dark>
                                {{ 'Error Estructura' }}
                            </v-chip>
                            <v-chip small v-if="item.estado_id == 27" :color="colorEstado(item.estado_id)" dark>
                                {{ 'Error Contenido' }}
                            </v-chip>
                            <v-chip small v-if="item.estado_id == 28" :color="colorEstado(item.estado_id)" dark>
                                {{ 'Error Sistema' }}
                            </v-chip>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-card>
    </div>
</template>

<script>
    import {
        mapActions
    } from "vuex";
    import Pusher from "pusher-js";
    export default {
        name: 'WorkspaceJsonValidadorRips',

        data() {
            return {
                erroresPrevios: [],
                dialogError: false,
                soporteFile: null,
                formvalid: true,
                fileName: "",
                errores: [],
                files: [],
                files2284: [],
                archivojson: null,
                archivoxml: null,
                archivocuv: null,
                dialog: false,
                preload: false,
                entidad: 1,
                listaPaquetes: [],
                todosRipsJsonPorEntidad: [],
                tipoResolucion: null,
                resolucion: ['2284', '3374'],
                rule: [
                    v => !!v || 'El campo es requerido',
                ],
                entidades: [{
                    id: 1,
                    nombre: 'RES004'
                }, {
                    id: 3,
                    nombre: 'EAS027'
                }, {
                    id: 8,
                    nombre: 'EAS027-1'
                }],
                headersRipsCargados: [{
                        text: 'NIT',
                        sortable: false,
                        value: 'prestador.nit'
                    },
                    {
                        text: 'Prestador',
                        sortable: false,
                        value: 'prestador.nombre_prestador'
                    },
                    {
                        text: '# Factura',
                        sortable: false,
                        value: 'numero_factura'
                    },
                    {
                        text: 'Codigo prestador',
                        sortable: false,
                        value: 'prestador.codigo_habilitacion'
                    },
                    {
                        text: 'Acciones',
                        sortable: false
                    },
                ],
                headers: [{
                        text: 'Paquete',
                        value: 'nombre',
                        sortable: false,
                        align: "center"
                    },
                    {
                        text: 'Codigo habilitación',
                        value: 'codigo',
                        sortable: false,
                        align: "center"
                    },
                    {
                        text: 'Fecha última carga',
                        value: 'created_at',
                        sortable: false,
                        align: "center"
                    },
                    {
                        text: 'Estado',
                        value: 'estado_id',
                        sortable: false,
                        align: "center"
                    },
                    {
                        text: '',
                        value: 'actions',
                        sortable: false
                    },
                ],
            };
        },

        mounted() {
            Pusher.logToConsole = false;
            const pusher = new Pusher(this.$config.PUSHER_KEY, {
                cluster: 'mt1',
                forceTLS: false,
                encrypted: false
            });
            const channel = pusher.subscribe(this.$config.PUSHER_CHANNEL);
            channel.bind('rips', data => {
                this.listarPaquetesCargados();
            });
            this.listarPaquetesCargados();
        },

        methods: {
            ...mapActions("app", ["setPreload"]),
            async valid() {
                if (!this.entidad) {
                    this.$toast.error('El Campo Entidad es Requerido!');
                    return;
                }

                if (this.files.length === 0) {
                    this.$toast.error(
                        'Se requiere mínimo el archivo "CT" y el archivo "AC" combinados con otro archivo de reporte'
                    );
                    return;
                }


                try {
                    this.setPreload(true);
                    const res = await this.$axios.get('/rips/autorizacionPeriodoRips');

                    if (!res.data.enabled) return;

                    this.preload = true;
                    this.isSuccessful = false;
                    this.inconsistencias = [];
                    this.ctRips = [];

                    this.$swal({
                        title: "Información",
                        text: "Esta validación puede tardar unos minutos, puede minimizar esta ventana y continuar usando el sistema.",
                        type: "info"
                    });

                    const formData = new FormData();
                    formData.append('entidad', this.entidad);
                    this.soporteFile.forEach(file => {
                        formData.append('soporte[]', file);
                    })

                    this.files.forEach(file => {
                        formData.append('files[]', file);
                    });

                    await this.$axios.post('/rips/validar', formData);

                    this.$toast.success('¡Se han cargado los archivos correctamente!');
                    this.listarPaquetesCargados();

                } catch (error) {
                    console.error(error.response);
                    if (error.response.data.hasOwnProperty('errors')) {
                        this.dialogError = true;
                        this.erroresPrevios = error.response.data.errors
                    }
                    this.$toast.error('Ocurrió un error al validar los archivos.');
                } finally {
                    this.setPreload(false);
                }
            },
            listarPaquetesCargados() {
                this.$axios.get('/rips/enProcesoValidacion').then(res => {
                    this.listaPaquetes = res.data;
                    console.log(this.listaPaquetes);
                })
            },
            onPickFile() {
                this.$refs.fileInput.click()
            },
            onFilePicked(event) {
                const files = event.target.files
                if (files[0] !== undefined) {
                    for (const [key, value] of Object.entries(files)) {
                        this.fileName += value.name + ", "
                    }

                } else {
                    this.fileName = ''
                }
            },
            limpiarFormularios() {
                this.entidad = null;
                this.files = [];
                this.$refs.fileInput.value = null;
                this.soporteFile = null;
            },
            colorEstado(estado) {
                let color = 'primary'
                switch (parseInt(estado)) {
                    case 26:
                    case 24:
                        color = "orange";
                        break;
                    case 25:
                    case 27:
                    case 28:
                        color = "red";
                        break;
                }
                return color;
            },
            descargarErrores(id) {
                this.preload = true;
                this.$axios.get('/rips/descargarerrores/' + id, {
                        responseType: "blob"
                    })
                    .then(res => {
                        let blob = new Blob([res.data], {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                        });
                        let url = window.URL.createObjectURL(blob);
                        let a = document.createElement('a');

                        a.download = "RegistroErrores" + id
                        a.href = url;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        this.preload = false;
                    }).catch(err => {
                        this.preload = false;
                        console.log(err)
                    })
            },
            eliminarValidacion(item) {
                this.$swal.fire({
                    title: 'Eliminar Validacion?',
                    text: 'Una vez eliminado, se perdera la información',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: "#4CAF50",
                    cancelButtonColor: "#FF5252",
                    confirmButtonText: "SI",
                    cancelButtonText: "NO"
                }).then(async (result) => {
                    if (result.value) {
                        this.preload = true;
                        this.$axios.get('/rips/eliminarProcesoValidacion/' + item.id).then(res => {
                            this.listarPaquetesCargados();
                            this.limpiarFormularios();
                            this.$toast.success(res.data.message);
                            this.preload = false;
                        }).catch(e => {
                            this.$alerError(e.response.data.message);
                            this.preload = false;
                        })

                    }
                });
            },

            GuardarRipsJson() {
                if (this.$refs.form.validate()) {
                    this.setPreload(true);

                    const formData = new FormData();

                    if (this.archivojson) {
                        formData.append('archivojson', this.archivojson);
                    }
                    if (this.archivoxml) {
                        formData.append('archivoxml', this.archivoxml);
                    }
                    if (this.archivocuv) {
                        formData.append('archivocuv', this.archivocuv);
                    }
                    this.soporteFile.forEach(file => {
                        formData.append('soporte[]', file);
                    })

                    this.$axios.post('/rips/guardar-archivos', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                        .then(res => {
                            this.setPreload(false);
                            this.limpiar();
                            this.$toast.success('RIPS guardados correctamente.');
                            const data = res.data;

                            // if (data.estado === 28) {
                            //     this.$swal.fire({
                            //         title: 'RIPS pendientes por validar CUV',
                            //         text: 'Los RIPS fueron guardados pero están pendientes por validar el CUV. Una vez validado, se emitirá el certificado.',
                            //         icon: 'info',
                            //         confirmButtonColor: "#4CAF50",
                            //         confirmButtonText: "Aceptar"
                            //     });
                            // }
                            // if (data.estado === 28) {
                            //     this.$swal.fire({
                            //         title: 'RIPS pendientes por validar CUV',
                            //         text: 'Los RIPS fueron guardados pero están pendientes por validar el CUV. Una vez validado, se emitirá el certificado.',
                            //         icon: 'info',
                            //         confirmButtonColor: "#4CAF50",
                            //         confirmButtonText: "Aceptar"
                            //     });
                            // }
                            const responseObject = JSON.parse(error.response.data.error);
                            const estado = responseObject.body.ResultadosValidacion[0]['Clase'];
                            const resultadosBase = responseObject.body;
                            const descripcion1 = resultadosBase.CodigoUnicoValidacionToShow;
                            const codigo = responseObject.body.ResultadosValidacion[0]['Codigo'];
                            const fuente = responseObject.body.ResultadosValidacion[0]['Fuente'];

                            // this.$swal.fire({
                            //     title: 'Success',
                            //     html: `
                            //    <div>
                            //         <b>Codigo:</b> ${codigo}
                            //     </div>
                            //    <div>
                            //         <b>Estado:</b> ${estado}
                            //     </div>
                            //    <div>
                            //         <b>Estado:</b> ${fuente}
                            //     </div>
                            //    <div>
                            //         <b>Descripción:</b> ${descripcion1}
                            //     </div>
                            // `,
                            //     icon: 'error',
                            //     confirmButtonColor: "#FF5252",
                            //     confirmButtonText: "Aceptar"
                            // });
                            this.imprimir({
                                tipo: 'certificadoRips',
                                id: data.ripsJson['id'],
                                tipoRip: 1
                            });

                        })
                        .catch(error => {
                            this.setPreload(false);

                            this.$swal.fire({
                                title: 'Error',
                                html: `
                                   <div>
                                        <b>Estado:</b> ${error.response.status}
                                    </div>
                                   <div>
                                        <b>Descripción:</b> ${error.response.data.error}
                                    </div>
                                `,
                                type: 'error',
                                confirmButtonColor: "#FF5252",
                                confirmButtonText: "Aceptar"
                            });
                            this.limpiar();
                        });
                }
            },

            limpiar() {
                this.archivojson = null;
                this.archivoxml = null;
                this.archivocuv = null;
                this.soporteFile = null;
            },

            listarRipsJsonPorEntidad() {
                this.$axios.get('/rips/historico-rips-entidad' + '/' + 1).then(res => {
                    this.todosRipsJsonPorEntidad = res.data;
                    console.log(this.todosRipsJsonPorEntidad);
                })
            },

            imprimir(data) {
                this.$axios.post('pdf', data, {
                    responseType: "arraybuffer"
                }).then(res => {
                    let blob = new Blob([res.data], {
                        type: "application/pdf"
                    });
                    let link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    window.open(link.href, "_blank");
                });
            },

            GenerarRipsHorus1() {
                this.$swal.fire({
                    title: 'Generar RIPS Horus 1',
                    text: '¿Está seguro de que desea generar los RIPS Horus 1?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: "#4CAF50",
                    cancelButtonColor: "#FF5252",
                    confirmButtonText: "SI",
                    cancelButtonText: "NO"
                }).then(async (result) => {
                    if (result.value) {
                        // this.setPreload(true);
                        await this.$axios.post('/rips/ripsJsonHorus1').then(res => {
                            console.log(res.data);
                        });

                        // this.setPreload(false);
                        this.$toast.success('RIPS Horus 1 generados correctamente.');
                    }
                });
            },

            generarRIPS(){
                this.$swal.fire({
                    title: 'Generar RIPS',
                    text: '¿Está seguro de que desea generar los RIPS?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: "#4CAF50",
                    cancelButtonColor: "#FF5252",
                    confirmButtonText: "SI",
                    cancelButtonText: "NO"
                }).then(async (result) => {
                    if (result.value) {
                        // this.setPreload(true);
                        await this.$axios.post('/rips/generarRIPSJanier').then(res => {
                            console.log(res.data);
                        });

                        // this.setPreload(false);
                        this.$toast.success('RIPS generados correctamente.');
                    }
                });
            },

        },
    };

</script>

<style lang="scss" scoped>

</style>
