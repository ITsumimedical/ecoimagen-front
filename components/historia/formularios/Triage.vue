<template>
    <v-form ref="triage" lazy-validation>
        <v-col cols="12" sm="12" md="12">
            <v-alert class="text-center" dense text type="info" icon="mdi-message-question-outline" border="left">
                <b>TRIAGE</b></v-alert>
            <v-row dense>
                <v-col cols="12" sm="12" md="12">
                    <v-select outlined :items="sino" v-model="motivo.reingreso" label="Reingreso"></v-select>
                </v-col>
                <v-col cols="12" sm="12" md="12" v-if="datos.estado_triage">
                    <v-select outlined :items="listaTriage" v-model="motivo.triage" label="Triage" required
                        @change="mandarTriage()" :rules="[v => !!v || 'El campo triage es requerido']" readonly>
                        <template v-slot:item="{ item }">
                            {{item}}
                            <v-icon large small :color="getColor(item)">
                                mdi-circle
                            </v-icon>
                        </template>
                        <template v-slot:selection="{ item }">
                            {{ item }}
                            <v-icon large small :color="getColor(item)">
                                mdi-circle
                            </v-icon>
                        </template>
                    </v-select>
                </v-col>
				 <v-col cols="12" sm="12" md="12" v-if="!datos.estado_triage">
                    <v-select outlined :items="listaTriage" v-model="motivo.triage" label="Triage" required
                        @change="mandarTriage()" :rules="[v => !!v || 'El campo triage es requerido']">
                        <template v-slot:item="{ item }">
                            {{item}}
                            <v-icon large small :color="getColor(item)">
                                mdi-circle
                            </v-icon>
                        </template>
                        <template v-slot:selection="{ item }">
                            {{ item }}
                            <v-icon large small :color="getColor(item)">
                                mdi-circle
                            </v-icon>
                        </template>
                    </v-select>
                </v-col>
            </v-row>
        </v-col>
    </v-form>
</template>
<script>
    import moment from "moment";
    export default {
        name: "triage",
        props: ['datos', 'resumen'],
        data() {
            return {
                motivo: {
                    triage: '',
                    reingreso: ''
                },
                errores: {
                    Motivoconsulta: '',
                    Enfermedadactual: ''
                },
                listaTriage: ['TRIAGE I', 'TRIAGE II', 'TRIAGE III', 'TRIAGE IV', 'TRIAGE V'],
                sino: ['Si', 'No'],
                valoraciones: [],
                rules: [
                    v => !!v || 'Este campo es requerido',
                ],
            }
        },
        created() {
            this.motivo = this.resumen;
            this.fetchValoraciones();
        },
        methods: {
            validarErrores() {
                return this.$refs.triage.validate();
            },
            fetchValoraciones() {
                this.$axios.get('historia/valoraciones/' + this.datos.afiliado_id)
                    .then(res => {
                        this.valoraciones = res.data;
                    });
            },

            mandarTriage() {
                // if (this.motivo.triage == 'TRIAGE I' || this.motivo.triage == 'TRIAGE II' || this.motivo.triage ==
                //     'TRIAGE III') {
                //     this.$axios.post("cie10/consultarCie10Consulta", {
                //             consulta: this.datos.id
                //         })
                //         .then((res) => {
                //             if (res.data.length > 0) {
                //                 const data = {
                //                     'cie10s': res.data.map(item => item.cie10_id),
                //                     'tipo_anexo': '2',
                //                     'afiliado_id': this.datos.afiliado.numero_documento,
                //                     'entidad_id': this.datos.afiliado.entidad_id,
                //                     'descripcion': this.resumen.motivo_consulta,
                //                     'admision': this.datos.admision_urgencia_id,
                //                     'consulta': this.datos.id
                //                 }
                //                 this.$axios.post("/referencias/crearUrgencia", data)
                //                     .then((res) => {
                //                         this.preload = false;
                //                     })
                //                     .catch((error) => {
                //                         this.preload = false;
                //                     });
                //             } else {
                //                 this.$toast.error(
                //                     "Por favor registrar el diagnostico de la consulta para poder continuar");
                //             }
                //             this.preload = false;
                //         })
                //         .catch((err) => {
                //             this.preload = false;
                //         });
                // }

            },

            getColor(item) {
                if (item == 'TRIAGE I') {
                    return 'red'
                } else if (item == 'TRIAGE II') {
                    return 'orange'
                } else if (item == 'TRIAGE III') {
                    return 'yellow'
                } else if (item == 'TRIAGE IV') {
                    return 'green'
                } else if (item == 'TRIAGE V') {
                    return 'blue'
                }
            }
        }
    }

</script>
