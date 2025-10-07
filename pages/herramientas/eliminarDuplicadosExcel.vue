<template>
    <v-card>
        <v-card-title>
            <v-toolbar flat class="d-flex flex-wrap align-center">
                <v-toolbar-title class="d-flex align-center">
                    <img src="/images/ojo.svg" alt="Ojo Horus" height="50px" width="50px" />
                    <span class="ml-2 font-weight-bold">Eliminar duplicados en Excel</span>
                </v-toolbar-title>
            </v-toolbar>
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12">
                    <v-alert type="info" color="#0E4578" outlined>
                        Esta herramienta permite eliminar filas duplicadas en un archivo Excel basado en un nombre de
                        fila específico.
                    </v-alert>

                </v-col>
            </v-row>
        </v-card-text>
        <v-form ref="form">
            <v-col cols="12">
                <v-file-input v-model="file" label="Agregue el documento de excel" prepend-icon=""
                    prepend-inner-icon="mdi-paperclip" show-size type="file" accept=".xlsx" truncate-length="25"
                    outlined dense></v-file-input>
            </v-col>
            <v-col cols="12">
                <v-text-field v-model="nombre_fila" type="text" prepend-icon=""
                    prepend-inner-icon="mdi-text" dense outlined
                    label="Agregue el nombre de la fila donde se encuentran los duplicados"></v-text-field>
            </v-col>
        </v-form>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-col cols="12" md="1" sm="1" align="center">
                <v-tooltip left>
                    <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">
                            <v-icon x-large color="warning">mdi-information-variant-circle-outline</v-icon>
                        </span>
                    </template>
                    <span>
                        <b>Importante:</b>
                        <ul>
                            <li>La primera fila del archivo debe contener los titulos o nombres de fila.</li>
                            <li>El titulo debe estar separado con guión bajo si es más de una palabra.</li>
                            <li>El nombre de la fila a la cual se le desea eliminar duplicados debe diligenciarse igual
                                que el registrado en el archivo.</li>
                        </ul>
                    </span>
                </v-tooltip>
            </v-col>
            <v-btn dense dark color="success" @click="procesar">Procesar</v-btn>
        </v-card-actions>
    </v-card>

</template>

<script>
import { crearExcel, eliminarDuplicados, leerExcel } from '@/utils/excel';
import { mapActions } from 'vuex';

export default {
    name: "EliminarDuplicadosExcel",
    data() {
        return {
            file: null,
            nombre_fila: null,

        };
    },
    methods: {
        ...mapActions('app', ['setPreload']),
        async procesar() {
            if (!this.file || !this.nombre_fila) {
                this.$swal({
                    type: 'warning',
                    title: 'Atención',
                    text: 'Debe seleccionar un archivo y especificar el nombre de la fila a eliminar duplicados.',
                    confirmButtonText: 'Aceptar'
                })

                return false;
            }
            this.setPreload(true)
            try {
                const data = await leerExcel(this.file)

                const textoFila = this.nombre_fila.trim().toLowerCase()

                const { filas_unicas, filas_duplicadas } = eliminarDuplicados(data, textoFila)

                this.file = null
                this.nombre_fila = null

                return crearExcel(filas_unicas)

            } catch (error) {
                console.error(error.message)
                this.$toast.error("Se generó un error al procesar el archivo. Asegúrese de que el archivo sea un Excel válido y que la fila especificada exista.")
            } finally {
                this.setPreload(false)
            }

        },

    }
}

</script>