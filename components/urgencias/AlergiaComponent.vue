<template>
    <div>
        <v-card>
            <v-alert dense text color="blue" class="text-center">
                <b>Antecedentes Alergicos</b></v-alert>
            <v-divider></v-divider>
            <v-card-text>
                <!-- <pre>{{datos}}</pre> -->
              <v-textarea v-model="alergia" rows="2" dense>
              </v-textarea>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small color="red" dark @click="$emit('cerrar')">Cerrar</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import {
        mapActions
    } from "vuex";

    export default {
        props: {
            datos: Object,
        },
        name: 'triage',
        data() {
            return {
               alergia:''
            }
        },
        mounted() {
            this.alergia = this.datos.admision_urgencia.consulta.historia_clinica.alergia != null ?this.datos.admision_urgencia.consulta.historia_clinica.alergia:'No tiene'
        },

        watch: {

        },

        methods: {
            ...mapActions('app', ['setPreload']),

        }
    }

</script>
