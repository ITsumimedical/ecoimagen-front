<template>
    <div>
        <v-alert dense text border="left" color="blue-grey" icon="mdi-page-next-outline">Seguimiento a concurrencia
        </v-alert>
        <v-row dense>
            <!-- seguimiento concurrencia -->
            <v-col cols="12" sm="12" md="12">
                <v-textarea auto-grow v-model="formSeguimiento.notas" dense label="Nota de seguimiento"></v-textarea>
            </v-col>
        </v-row>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="guardarSeguimiento()" color="success" small>Registrar seguimiento</v-btn>
        </v-card-actions>
        <v-col cols="12" v-if="this.seguimientos.length > 0">
            <template>
                <div>
                    <v-timeline dense>
                        <v-timeline-item small v-for="n in this.seguimientos" :key="n.id">
                            <v-card class="elevation-2">
                                <v-card-title class="text-h5">
                                    <small><b>Seguimiento #</b> {{ n.id }}</small>
                                    <v-spacer></v-spacer>
                                    <small><b>Realizado por: </b>
                                        {{ n.usuario_crea?.operador?.nombre }} {{ n.usuario_crea?.operador?.apellido }}
                                    </small>
                                    <v-spacer></v-spacer>
                                    <small><b>Fecha de registro: </b>
                                        {{ n.created_at.substring(0, 10) }}</small>
                                </v-card-title>
                                <v-col cols="12">
                                    <v-row dense>
                                        <v-card-text>
                                            <v-textarea auto-grow readonly :value="n.notas"></v-textarea>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn v-if="n.usuario_dss === null" small color="info"
                                                    @click="campoDss = true">
                                                    <v-icon left>mdi-text-search-variant</v-icon>nota dirección de
                                                    servicios de salud
                                                </v-btn>
                                                <v-btn v-if="n.usuario_aac === null" small color="info"
                                                    @click="campoAac = true">
                                                    <v-icon left>mdi-currency-usd</v-icon>nota auditoría de alto costo
                                                </v-btn>
                                            </v-card-actions>
                                            <v-col cols="12">
                                                <v-row dense>
                                                    <v-col cols="6">
                                                        <v-form v-if="campoDss == true">
                                                            <v-alert text dense border="left" color="blue-grey"
                                                                icon="mdi-note-plus-outline">Registro
                                                                nota dirección de servicios de salud <b>Seguimiento #
                                                                    {{ n.id }}</b>
                                                            </v-alert>
                                                            <v-col cols="12" sm="12" md="12">
                                                                <v-textarea auto-grow v-model="formSeguimiento.nota_dss"
                                                                    dense
                                                                    label="Nota dirección de servicios de salud"></v-textarea>
                                                            </v-col>
                                                            <v-card-actions>
                                                                <v-spacer></v-spacer>
                                                                <v-btn small color="success"
                                                                    @click="actualizarDss(n)">Guardar nota
                                                                    dirección</v-btn>
                                                            </v-card-actions>
                                                        </v-form>
                                                    </v-col>
                                                    <v-col cols="6">
                                                        <v-form v-if="campoAac == true">
                                                            <v-alert text dense border="left" color="blue-grey"
                                                                icon="mdi-currency-usd">Registro nota
                                                                auditoría alto costo <b>Seguimiento # {{ n.id }}</b>
                                                            </v-alert>
                                                            <v-col cols="12" sm="12" md="12">
                                                                <v-textarea auto-grow v-model="formSeguimiento.nota_aac"
                                                                    dense
                                                                    label="Nota auditoría de alto costo"></v-textarea>
                                                            </v-col>
                                                            <v-card-actions>
                                                                <v-spacer></v-spacer>
                                                                <v-btn small color="success"
                                                                    @click="actualizarAac(n)">Guardar nota
                                                                    auditoría</v-btn>
                                                            </v-card-actions>
                                                        </v-form>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-row dense>
                                                    <v-col cols="6" v-if="n.usuario_dss">
                                                        <v-alert text dense border="left" icon="mdi-history"
                                                            color="blue-grey">
                                                            <b>nota de dirección de servicios de salud</b> -
                                                            {{ n.usuario_dss?.operador?.nombre || '' }} {{
                                                            n.usuario_dss?.operador?.apellido || '' }}
                                                        </v-alert>
                                                        <v-col cols="12">
                                                            {{ n.nota_dss }}
                                                            <v-spacer></v-spacer>
                                                            <b>Fecha de seguimiento:
                                                            </b><i>{{ n.created_at.substring(0, 10) }}</i>
                                                        </v-col>
                                                    </v-col>
                                                    <v-col cols="6" v-if="n.usuario_aac">
                                                        <v-alert text dense border="left" icon="mdi-history"
                                                            color="blue-grey">
                                                            <b>nota de auditoría de alto costo</b> -
                                                            {{ n.usuario_aac?.operador?.nombre || '' }} {{
                                                            n.usuario_aac?.operador?.apellido || '' }}
                                                        </v-alert>
                                                        <v-col cols="12">
                                                            {{ n.nota_aac }}
                                                            <v-spacer></v-spacer>
                                                            <b>Fecha de seguimiento:
                                                            </b><i>{{ n.created_at.substring(0, 10) }}</i>
                                                        </v-col>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                        </v-card-text>
                                    </v-row>
                                </v-col>
                            </v-card>
                        </v-timeline-item>
                    </v-timeline>
                </div>
            </template>
        </v-col>
    </div>
</template>

<script>
export default {
    name: 'WorkspaceJsonSeguimientoConcurrencia',

    data() {
        return {
            formSeguimiento: {
                notas: null,
                nota_dss: null,
                nota_aac: null,
                nota_lc: null,
                nota_ingreso: false,
                concurrencia_id: null,
                user_id: null,
                user_notadss_id: null,
                user_notaaac_id: null,
                user_notalc_id: null,
                id: null,
            },
            campoDss: false,
            campoAac: false,
            seguimientos: [],
        };
    },

    props: {
        IngresoConcurrencia: {
            type: Number,
        }
    },

    mounted() {
        this.listarSeguimiento()
    },

    methods: {

        guardarSeguimiento() {
            if (this.formSeguimiento.notas == null) {
                return this.$toast.error('Debes registrar la información de la nota de seguimiento')
            }
            this.formSeguimiento.concurrencia_id = this.IngresoConcurrencia;
            this.$axios.post("concurrencia/crearSeguimiento", this.formSeguimiento).then((res) => {
                this.formSeguimiento.notas = null
                this.listarSeguimiento()
                return this.$toast.success('se ha registrado el seguimiento de concurrencia correctamente!.')
            })
                .catch((err) => {
                    this.$toast.error("Ocurrió un error al crear el seguimiento de concurrencia");
                    console.log(err);
                })
        },

        listarSeguimiento() {
            this.$axios.get('/concurrencia/seguimiento/' + this.IngresoConcurrencia).then(res => {
                this.seguimientos = res.data
            }).catch(e => {
                console.log(e.response.data);
            })
        },

        actualizarDss(n) {
            this.formSeguimiento.user_notadss_id = this.$store.state.auth.usuario.id,
                this.formSeguimiento.id = n.id,
                this.formSeguimiento.concurrencia_id = this.IngresoConcurrencia
            this.$axios.put("concurrencia/actualizarSeguimiento", this.formSeguimiento).then((res) => {
                this.campoDss = false
                this.formSeguimiento.nota_dss = null
                this.listarSeguimiento()
                return this.$toast.success('se ha registrado la nota correctamente!.')
            })
                .catch((err) => {
                    this.$toast.error("Ocurrió un error al crear la nota");
                    console.log(err);
                })
        },

        actualizarAac(n) {
            this.formSeguimiento.user_notaaac_id = this.$store.state.auth.usuario.id,
                this.formSeguimiento.id = n.id,
                this.formSeguimiento.concurrencia_id = this.IngresoConcurrencia
            this.$axios.put("concurrencia/actualizarSeguimiento", this.formSeguimiento).then((res) => {
                this.campoAac = false
                this.formSeguimiento.nota_aac = null
                this.listarSeguimiento()
                return this.$toast.success('se ha registrado la nota correctamente!.')
            })
                .catch((err) => {
                    this.$toast.error("Ocurrió un error al crear la nota");
                    console.log(err);
                })
        },

    },
};

</script>
