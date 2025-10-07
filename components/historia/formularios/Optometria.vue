<template>
    <div>
        <v-form>
            <v-row>
                <v-col xs="12" sm="12" md="12">
                    <v-alert class="text-center" dense text border="left" type="info" icon="mdi-medication-outline">
                        <b>LENSOMETRIA</b></v-alert>
                </v-col>

                <v-col cols="12" sm="12" md="12">
                    <v-alert icon="mdi-eye-arrow-right-outline" text dense color="warning" border="left"
                        class="text-center">
                        <b>OJO DERECHO</b>
                    </v-alert>
                </v-col>

                <v-col cols="12" sm="12" md="12">
                    <v-textarea label="Descripción" v-model="optometria.lateralidad_od" dense outlined auto-grow></v-textarea>
                </v-col>

                <v-col cols="12" sm="12" md="3">
                    <v-text-field v-model="optometria.esf_od" label="ESF" outlined dense>
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="3">
                    <v-text-field v-model="optometria.cyl_od" label="CYL" outlined dense>
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="3">
                    <v-text-field v-model="optometria.eje_od" label="EJE" outlined dense>
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="3">
                    <v-text-field v-model="optometria.add_od" label="ADD" outlined dense>
                    </v-text-field>
                </v-col>


                <v-col cols="12" sm="12" md="12">
                    <v-alert icon="mdi-eye-arrow-left-outline" text dense color="warning" border="left"
                        class="text-center">
                        <b>OJO IZQUIERDO</b>
                    </v-alert>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-textarea label="Descripción" v-model="optometria.lateralidad_oi" dense outlined auto-grow></v-textarea>
                </v-col>

                <v-col cols="12" sm="12" md="3">
                    <v-text-field v-model="optometria.esf_oi" label="ESF" outlined dense>
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="3">
                    <v-text-field v-model="optometria.cyl_oi" label="CYL" outlined dense>
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="3">
                    <v-text-field v-model="optometria.eje_oi" label="EJE" outlined dense>
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="3">
                    <v-text-field v-model="optometria.add_oi" label="ADD" outlined dense>
                    </v-text-field>
                </v-col>

                <v-col xs="12" sm="12" md="12">
                    <v-alert class="text-center" dense text type="info" icon="mdi-eye-check-outline" border="left">
                        <b>AGUDEZA VISUAL</b></v-alert>
                </v-col>
                <v-col class="d-flex justify-center">
                        <v-checkbox v-model="optometria.checkboxsc" value="Si" label="SC" outlined dense></v-checkbox>
                        <v-checkbox v-model="optometria.checkboxcc" label="CC" value="Si" outlined dense></v-checkbox>
                </v-col>

                <v-col xs="12" sm="12" md="12">
                    <v-alert class="text-center" dense text border="left" type="info" icon="mdi-book-open-page-variant">
                        <b>VL</b></v-alert>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-alert text dense color="warning" border="left" class="text-center" icon="mdi-eye-arrow-right-outline"><b>OJO DERECHO</b></v-alert>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-alert text dense color="warning" border="left" class="text-center" icon="mdi-eye-arrow-left-outline"><b>OJO IZQUIERDO</b></v-alert>
                </v-col>
                <v-col cols="12" sm="12" md="3">
                    <v-text-field label="Descripción" v-model="optometria.agudeza_od" outlined dense></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="3">
                    <v-text-field v-model="optometria.agudezavp_od" label="VP" outlined dense></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="3">
                    <v-text-field v-model="optometria.agudeza_oi" label="Descripción" outlined dense></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="3">
                    <v-text-field v-model="optometria.agudezavp_oi" label="VP" outlined dense></v-text-field>
                </v-col>

                <v-col xs="12" sm="12" md="12">
                    <v-alert class="text-center" dense text border="left" type="info" icon="mdi-eye-settings">
                        <b>MOTILIDAD OCULAR</b></v-alert>
                </v-col>
                <v-col cols="12" sm="12" md="4">
                    <v-text-field v-model="optometria.ocular_vl" label="VL" outlined dense></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4">
                    <v-text-field v-model="optometria.ocular_vp" label="VP" type="number" outlined dense></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4">
                    <v-text-field v-model="optometria.ocular_ppc" label="PPC" outlined dense></v-text-field>
                </v-col>
            </v-row>
        </v-form>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {

    props: ['datos', 'resumen'],

    data() {
        return {
            optometria: {}
        }
    },

    created() {
        const datosOptometria = this.obtenerDatosPorConsulta(this.datos.id, 'Historia/Models/HistoriaClinica', 'historia/formularios/Optometria');

        if (datosOptometria) {
            this.optometria = {...datosOptometria}
        }
    },

    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },

    methods: {

        obtenerDatos() {
            return { datos: this.optometria };
        },
        validarErrores() {
            return [];
        },
    }
}
</script>
