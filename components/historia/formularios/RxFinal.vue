<template>
    <div>
        <v-alert text dense color="info" border="left" class="text-center" icon="mdi-radiology-box-outline"><b>RX
                FINAL</b></v-alert>
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-row>
                <v-col cols="12" sm="12" md="12">
                    <v-alert border="left" text dense color="warning" class="text-center"
                        icon="mdi-eye-arrow-right-outline">
                        <b>OJO DERECHO</b>
                    </v-alert>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                    <v-text-field label="Esfera" v-model="derecho.esfera_ojo_derecho" dense outlined
                        :rules="campoRequerido"></v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                    <v-text-field label="Clindro" v-model="derecho.cilindro_ojo_derecho" dense outlined
                        :rules="campoRequerido"></v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                    <v-text-field label="Eje" dense outlined v-model="derecho.eje_ojo_derecho"
                        :rules="campoRequerido"></v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                    <v-text-field label="Adicion" dense outlined v-model="derecho.add_ojo_derecho"
                        :rules="campoRequerido"></v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                    <v-text-field label="Prisma base" dense outlined v-model="derecho.prima_base_ojo_derecho"
                        :rules="campoRequerido"></v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                    <v-text-field label="Grados" dense outlined v-model="derecho.grados_ojo_derecho"
                        :rules="campoRequerido"></v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                    <v-text-field label="AV lejos" dense outlined v-model="derecho.av_lejos_ojo_derecho"
                        :rules="campoRequerido"></v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                    <v-text-field label="AV Cerca" dense outlined v-model="derecho.av_cerca_ojo_derecho"
                        :rules="campoRequerido"></v-text-field>
                </v-col>
            </v-row>
        </v-form>
        <v-card-actions class="justify-center">
            <v-btn color="success" @click="crearRx()" :loading="loading">Guardar rx derecho</v-btn>
        </v-card-actions>
        <v-divider></v-divider>

        <v-data-table :headers="headerOjoDerecho" :items="ojoDerecho" :loading="loading"></v-data-table>

        <v-divider></v-divider>

        <v-col cols="12" sm="12" md="12">
            <v-alert border="left" text dense color="warning" class="text-center" icon="mdi-eye-arrow-left-outline">
                <b>OJO IZQUIERDO</b>
            </v-alert>
        </v-col>
        <v-form ref="formIzquierdo" v-model="valid" lazy-validation>
            <v-row>
                <v-col cols="12" sm="3" md="3">
                    <v-text-field label="Esfera" v-model="izquierdo.esfera_ojo_izquierdo" dense outlined
                        :rules="campoRequerido"></v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                    <v-text-field label="Clindro" v-model="izquierdo.cilindro_ojo_izquierdo" dense outlined
                        :rules="campoRequerido"></v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                    <v-text-field label="Eje" dense outlined v-model="izquierdo.eje_ojo_izquierdo"
                        :rules="campoRequerido"></v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                    <v-text-field label="Adicion" dense outlined v-model="izquierdo.add_ojo_izquierdo"
                        :rules="campoRequerido"></v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                    <v-text-field label="Prisma base" dense outlined v-model="izquierdo.prima_base_ojo_izquierdo"
                        :rules="campoRequerido"></v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                    <v-text-field label="Grados" dense outlined v-model="izquierdo.grados_ojo_izquierdo"
                        :rules="campoRequerido"></v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                    <v-text-field label="AV lejos" dense outlined v-model="izquierdo.av_lejos_ojo_izquierdo"
                        :rules="campoRequerido"></v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                    <v-text-field label="AV Cerca" dense outlined v-model="izquierdo.av_cerca_ojo_izquierdo"
                        :rules="campoRequerido"></v-text-field>
                </v-col>
            </v-row>
        </v-form>
        <v-card-actions class="justify-center">
            <v-btn color="success" @click="crearRxOjoIzquierdo()" :loading="loadingIzquierdo">
                Guardar rx izquierdo
            </v-btn>
        </v-card-actions>
        <v-divider></v-divider>
        <v-data-table :items="ojoIzquierdo" :headers="headerOjoIzquierdo" :loading="loadingIzquierdo"></v-data-table>
        <v-divider></v-divider>
        <v-col></v-col>


        <v-form ref="formObservaciones" v-model="valid" lazy-validation>
            <v-row>
                <v-col cols="12" sm="6" md="6">
                    <v-alert text dense color="warning" border="left">
                        <b>Tipo lentes:</b>
                    </v-alert>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-alert text dense color="warning" border="left">
                        <b>Detalle:</b>
                    </v-alert>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea hint="Descripción" dense outlined auto-grow
                        v-model="observaciones.tipo_lentes" :rules="campoRequerido"></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea hint="Descripción" dense outlined auto-grow
                        v-model="observaciones.detalle" :rules="campoRequerido"></v-textarea>
                </v-col>
            </v-row>


            <v-row>
                <v-col cols="12" sm="6" md="6">
                    <v-alert text dense color="warning" border="left">
                        <b>Altura:</b>
                    </v-alert>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-alert text dense color="warning" border="left">
                        <b>Color y Ttos:</b>
                    </v-alert>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea hint="Descripción" dense outlined auto-grow v-model="observaciones.altura" :rules="campoRequerido"></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea hint="Descripción" dense outlined auto-grow
                        v-model="observaciones.color_ttos" :rules="campoRequerido"></v-textarea>
                </v-col>
            </v-row>


            <v-row>
                <v-col cols="12" sm="6" md="6">
                    <v-alert text dense color="warning" border="left">
                        <b>Dp:</b>
                    </v-alert>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-alert text dense color="warning" border="left">
                        <b>Uso:</b>
                    </v-alert>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea hint="Descripción" dense outlined auto-grow v-model="observaciones.dp" :rules="campoRequerido"></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea hint="Descripción" dense outlined auto-grow v-model="observaciones.uso" :rules="campoRequerido"></v-textarea>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="6" md="6">
                    <v-alert text dense color="warning" border="left">
                        <b>Control:</b>
                    </v-alert>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-alert text dense color="warning" border="left">
                        <b>Duración vigencia:</b>
                    </v-alert>
                </v-col>
            </v-row>


            <v-row>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea hint="Descripción" dense outlined auto-grow
                        v-model="observaciones.control" :rules="campoRequerido"></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea hint="Descripción" dense outlined auto-grow
                        v-model="observaciones.duracion_vigencia" :rules="campoRequerido"></v-textarea>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="12" md="12">
                    <v-alert text dense color="warning" border="left">
                        <b>Observaciones:</b>
                    </v-alert>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="12" md="12">
                    <v-textarea hint="Descripción" dense outlined auto-grow
                        v-model="observaciones.observaciones" :rules="campoRequerido"></v-textarea>
                </v-col>
            </v-row>
        </v-form>

        <!-- <v-card-actions class="justify-center">
            <v-btn color="success" @click="crearObservaciones()" :loading="loadingObservaciones">Guardar
                observaciones</v-btn>
        </v-card-actions> -->

    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    props: ['datos'],
    data() {
        return {
            derecho: {
                esfera_ojo_derecho: '',
                cilindro_ojo_derecho: '',
                eje_ojo_derecho: '',
                add_ojo_derecho: '',
                prima_base_ojo_derecho: '',
                grados_ojo_derecho: '',
                av_lejos_ojo_derecho: '',
                av_cerca_ojo_derecho: '',
                consulta_id: this.datos.id
            },
            izquierdo: {
                esfera_ojo_izquierdo: '',
                cilindro_ojo_izquierdo: '',
                eje_ojo_izquierdo: '',
                add_ojo_izquierdo: '',
                prima_base_ojo_izquierdo: '',
                grados_ojo_izquierdo: '',
                av_lejos_ojo_izquierdo: '',
                av_cerca_ojo_izquierdo: '',
                consulta_id: this.datos.id
            },
            loadingObservaciones: false,
            observaciones: {
                tipo_lentes: '',
                detalle: '',
                altura: '',
                color_ttos: '',
                dp: '',
                uso: '',
                control: '',
                duracion_vigencia: '',
                observaciones: '',
                consulta_id: this.datos.id
            },
            ojoDerecho: [],
            ojoIzquierdo: [],
            valid: true,
            headerOjoIzquierdo: [
                {
                    text: 'Esfera',
                    value: 'esfera_ojo_izquierdo'
                },
                {
                    text: 'Cilindro',
                    value: 'cilindro_ojo_izquierdo'
                },
                {
                    text: 'Eje',
                    value: 'eje_ojo_izquierdo'
                },
                {
                    text: 'Adición',
                    value: 'add_ojo_izquierdo'
                },
                {
                    text: 'Prisma base',
                    value: 'prima_base_ojo_izquierdo'
                },
                {
                    text: 'Grados',
                    value: 'grados_ojo_izquierdo'
                },
                {
                    text: 'AV/LEJOS',
                    value: 'av_lejos_ojo_izquierdo'
                },
                {
                    text: 'AV/CERCA',
                    value: 'av_cerca_ojo_izquierdo'
                }
            ],
            headerOjoDerecho: [
                {
                    text: 'Esfera',
                    value: 'esfera_ojo_derecho'
                },
                {
                    text: 'Cilindro',
                    value: 'cilindro_ojo_derecho'
                },
                {
                    text: 'Eje',
                    value: 'eje_ojo_derecho'
                },
                {
                    text: 'Adición',
                    value: 'add_ojo_derecho'
                },
                {
                    text: 'Prisma base',
                    value: 'prima_base_ojo_derecho'
                },
                {
                    text: 'Grados',
                    value: 'grados_ojo_derecho'
                },
                {
                    text: 'AV/LEJOS',
                    value: 'av_lejos_ojo_derecho'
                },
                {
                    text: 'AV/CERCA',
                    value: 'av_cerca_ojo_derecho'
                }
            ],
            campoRequerido: [
                v => !!v || 'Este campo es requerido',
            ],
            loading: false,
            loadingIzquierdo: false
        }
    },

    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },

    mounted() {
        this.listarOjoDerecho();
        this.listarOjoIzquierdo();
        const datos = this.obtenerDatosPorConsulta(this.datos.id, 'RxFinal/Model/RxFinal', 'historia/formularios/RxFinal');
        if (datos) {
            this.observaciones = {...datos}
        }
    },

    methods: {

        obtenerDatos() {
            return { datos: this.observaciones };
        },
        crearRx() {
            if (!this.$refs.form.validate()) {
                return this.$toast.error('Campos obligatorios sin diligenciar')
            }
            this.loading = true;
            this.$axios.post('rxFinal/crear', this.derecho).then(() => {
                this.$toast.success('Creado con exito');
                this.listarOjoDerecho();
                this.limpiarCampos()
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                this.loading = false;
            })
        },

        listarOjoDerecho() {
            this.loading = true;
            this.$axios.post('rxFinal/listarDerecho', {
                consulta_id: this.datos.id
            }).then((res) => {
                this.ojoDerecho = res.data
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                this.loading = false;
            })
        },

        listarOjoIzquierdo() {
            this.loadingIzquierdo = true;
            this.$axios.post('rxFinal/listarOjoIzquierdo', {
                consulta_id: this.datos.id
            }).then((res) => {
                this.ojoIzquierdo = res.data
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                this.loadingIzquierdo = false;
            })
        },

        limpiarCampos() {
            this.derecho = {
                esfera_ojo_derecho: '',
                cilindro_ojo_derecho: '',
                eje_ojo_derecho: '',
                add_ojo_derecho: '',
                prima_base_ojo_derecho: '',
                grados_ojo_derecho: '',
                av_lejos_ojo_derecho: '',
                av_cerca_ojo_derecho: '',
                consulta_id: this.datos.id
            },
                this.$refs.form.resetValidation()
        },

        crearRxOjoIzquierdo() {
            if (!this.$refs.formIzquierdo.validate()) {
                return this.$toast.error('Campos obligatorios sin diligenciar')
            }
            this.loadingIzquierdo = true;
            this.$axios.post('rxFinal/crear', this.izquierdo).then(() => {
                this.$toast.success('Creado con exito');
                this.limpiarOjoIzquierdo()
                this.listarOjoIzquierdo()
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                this.loadingIzquierdo = false;
            })
        },

        crearObservaciones() {
            if (!this.$refs.formObservaciones.validate()) {
                return this.$toast.error('Campos obligatorios sin diligenciar')
            }
            this.loadingObservaciones = true;
            this.$axios.post('rxFinal/crear', this.observaciones).then(() => {
                this.$toast.success('Creado con exito');
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                this.loadingObservaciones = false;
            })
        },

        limpiarOjoIzquierdo() {
            this.izquierdo = {
                esfera_ojo_izquierdo: '',
                cilindro_ojo_izquierdo: '',
                eje_ojo_izquierdo: '',
                add_ojo_izquierdo: '',
                prima_base_ojo_izquierdo: '',
                grados_ojo_izquierdo: '',
                av_lejos_ojo_izquierdo: '',
                av_cerca_ojo_izquierdo: '',
                consulta_id: this.datos.id
            },
                this.$refs.formIzquierdo.resetValidation()

        }

    }
}
</script>
