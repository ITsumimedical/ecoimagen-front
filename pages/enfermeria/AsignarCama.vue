<template>
    <div>
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="">
                            <span>Asignar Cama</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" dark @click="consultarAfiliado()" small>Consultar
                </v-btn>
                <v-btn color="red" small dark @click="limpiar()">Limpiar
                </v-btn>
            </v-card-actions>
            <v-card-text>
                <v-form>
                    <v-row>
                        <v-col cols="6" md="6" sm="6">
                            <v-autocomplete dense outlined label="Tipo de Documento" :items="tiposDocumentos"
                                no-data-text="No hay resultados" item-value="id" item-text="nombre"
                                v-model="datosBuscarAfiliado.tipo_documento" />
                        </v-col>
                        <v-col cols="6" md="6" sm="6">
                            <v-text-field dense outlined label="Número Documento"
                                v-model.trim="datosBuscarAfiliado.numero_documento" />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>


            <v-card-text v-if="informacion">
                 <v-form ref="asignarCama">
                <v-row dense>
                    <v-col cols="12" md="12" sm="12">
                        <h2>{{'Paciente: '}}{{informacion.nombreAfiliado}}</h2>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                        <h2>{{'Ingreso: '}}{{informacion.id}}</h2>
                    </v-col>
                    <v-col cols="12" md="12" sm="12">
                        <h2>{{'Contrato: '}}{{informacion.contrato}}</h2>
                    </v-col>
                    <v-col cols="12" md="8" sm="12">
                        <v-text-field dense outlined label="Pabellón" v-model.trim="formulario.pabellon" readonly />
                    </v-col>
                    <v-col cols="12" md="8" sm="12">
                        <v-text-field dense outlined label="Cama" v-model.trim="formulario.cama" readonly  :rules="rules.cama"/>
                    </v-col>
                    <v-col cols="12" md="2" sm="12">
                        <v-btn icon color="info" @click="buscarCamas()">
                            <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                    </v-col>
                    <v-col cols="12" md="6" sm="12">
                        <v-autocomplete dense outlined label="Tipo de cama" :items="tipos"
                            no-data-text="No hay resultados" v-model="formulario.tipo_cama" :rules="rules.tipo_cama" />
                    </v-col>
                    <v-col cols="12" md="7" sm="12">
                        <v-text-field type="datetime-local" v-model="formulario.fecha" outlined label="Fecha y hora" :rules="rules.fecha">
                        </v-text-field>
                    </v-col>
                </v-row>
                 </v-form>
            </v-card-text>
            <v-card-actions v-if="informacion">
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="guardarAsignacion()" small>Guardar
                </v-btn>
            </v-card-actions>
        </v-card>
        <v-dialog v-model="dialogoPabellon" persistent max-width="900px">
            <v-card>
                <v-alert dense text border="left" icon="mdi-file-edit-outline" type="info" color="info">
                    <b>Camas</b>
                </v-alert>
                <v-card-text>

                        <v-row dense>
                            <v-col cols="12" md="12" sm="12">
                                <v-expansion-panels>
                                    <v-expansion-panel v-for="(item) in pabellones " :key="item.id">
                                        <v-expansion-panel-header>
                                            {{item.nombre}}
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <v-row>
                                                <v-col v-for="(cama, i) in item.camas" :key="i" cols="3" md="3" sm="3">
                                                    <v-card @click="mandarCama(cama)" style="border: 1px solid #000;">
                                                        <v-card-title class="text-h5">{{cama.nombre}}</v-card-title>
                                                    </v-card>
                                                </v-col>
                                            </v-row>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-col>
                        </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import {
        mapActions
    } from "vuex"
    export default {
        middleware({
            $can,
            redirect
        }) {
            if (!$can('blog.vista')) {
                return redirect('/');
            }
        },
        name: 'FrontHorusParametrizacion',
        data() {
            return {
                datosBuscarAfiliado: {},
                tiposDocumentos: [],
                informacion: null,
                formulario: {
                    fecha: this.$moment().format("YYYY-MM-DDTHH:mm")
                },
                pabellones: [],
                tipos: ['Sala de observacion'],
                dialogoPabellon: false,
                rules: {
					fecha: [(v) => !!v || "El campo fecha es requerido"],
					tipo_cama: [(v) => !!v || "El campo tipo de cama es requerido"],
					cama: [(v) => !!v || "El campo cama es requerido"],
				},
            };
        },

        mounted() {
            this.listarTiposDocumentos();
        },

        methods: {
            ...mapActions('app', ['setPreload']),
            listarTiposDocumentos() {

                this.$axios.get("/tipo-documento/listar")
                    .then((res) => {
                        this.tiposDocumentos = res.data;
                    })
                    .catch((error) => {
                        this.$toast.error(
                            "Ocurrió un error al cargar los tipos de documento"
                        );
                        console.log(error);
                    })
                    .finally(() => {
                        // this.loading = false;
                    });
            },

            consultarAfiliado() {
                this.setPreload(true)
                this.$axios.post('admisiones/listarAsignacionCama', this.datosBuscarAfiliado).then(
                    res => {
                        if(res.data.id){
                        this.informacion = res.data;
                        this.informacion.nombreAfiliado = res.data.primer_nombre + ' ' + res.data.primer_apellido
                        this.informacion.contrato = res.data.nombre + ' ' + res.data.nombre_prestador + ' ' + res.data.ambito
                        }

                    }).catch(e => {
                    console.log(e);
                }).finally(e => {
                    this.setPreload(false)
                })
            },

            buscarCamas() {
                this.setPreload(true)
                this.$axios.get("/pabellon/listarConCama")
                    .then((res) => {
                        this.pabellones = res.data;
                        this.dialogoPabellon = true
                    })
                    .catch((error) => {
                        this.$toast.error(
                            "Ocurrió un error al cargar los tipos de documento"
                        );
                    })
                    .finally(() => {
                        this.setPreload(false)
                    });
            },

            mandarCama(cama) {
                this.formulario.pabellon = this.pabellones.filter((item) => item.id == cama.pabellon_id).map((
                    pabellon) => {
                    return pabellon.nombre
                })
                this.formulario.cama = cama.nombre
                this.formulario.cama_id = cama.id
                this.formulario.tipo_cama = 'Sala de observacion'
                this.dialogoPabellon = false
            },

            guardarAsignacion() {
                if (!this.$refs.asignarCama.validate()) {
                    return
                }
                this.setPreload(true)
                this.formulario.admision_urgencia_id = this.informacion.id
                this.$axios.post('asignacion-cama/crear', this.formulario).then(res => {
                	this.limpiar()
                	this.$toast.success('Evolución creada con exito')
                	// this.listarAdmisionesUrgencias()
                }).catch(e => {
                	console.log(e);
                	// this.preload = false
                }).finally(e => {
                	this.setPreload(false)
                })

            },

            limpiar(){
                this.informacion = null
                this.datosBuscarAfiliado = {}
                this.pabellones = []
                this.formulario = {
                    fecha:'',
                    tipo_cama:'',
                    cama:'',
                    pabellon:'',
                    cama_id:''
                }
            }
        },
    };

</script>

<style lang="scss" scoped>

</style>
