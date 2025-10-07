<template>
    <div>
        <v-card>
            <v-alert text dense color="primary" class="text-center" icon="mdi-image-area" border="bottom">
                <b>Asignar Logo a la sede {{ rep_nombre }}</b>
            </v-alert>
            <v-card-text>
                <v-col cols="12">
                    <v-file-input :rules="reglasImagen" outlined dense v-model="image" label="Seleccionar imagen" append-icon="mdi-camera"
                        accept="image/*" />
                </v-col>

                <v-col cols="12" v-if="urlLogo">
                    <v-alert text dense color="blue-grey" border="bottom" class="text-center">
                        <b>Logo Registrado</b>
                    </v-alert>
                    <v-img :src="urlLogo" contain height="250" max-width="100%" class="my-4" />
                </v-col>


            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" small @click="limpiarData()">Cerrar</v-btn>
                <v-btn color="success" small :loading="loading" @click="crearLogo()">Guardar imagen</v-btn>
            </v-card-actions>
        </v-card>

        <v-dialog v-model="cargaPorcentaje" persistent max-width="300">
            <v-card>
                <v-card-title class="text-center">Subiendo imagen</v-card-title>
                <v-card-text class="text-center">
                    <v-progress-circular :value="progresoCarga" color="primary" size="70" width="7"
                        class="mx-auto my-4 d-flex">
                        {{ progresoCarga }}%
                    </v-progress-circular>
                    <p class="mt-3">Por favor espere mientras se procesa su imagen...</p>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        props: {
            rep_id: {
                type: Number,
            },
            rep_nombre: {
                type: String,
            }
        },

        data() {
            return {
                image: null,
                loading: false,
                cargaPorcentaje: false,
                progresoCarga: 0,
                urlLogo: null,
                reglasImagen: [
                    file => {
                        if (!file) return true;
                        const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
                        return tiposPermitidos.includes(file.type) || 'El archivo debe ser una imagen válida';
                    }
                ]
            }
        },

        methods: {
            limpiarData() {
                this.$emit('cerrarDialogoImagen');
                this.image = null;
                this.urlLogo = null;
            },

            async crearLogo() {
                if (!this.image) {
                    this.$toast.error('Seleccioná una imagen primero');
                    return;
                }

                this.loading = true;
                this.cargaPorcentaje = true;

                try {
                    const logoUrl = await this.registrarLogo();
                    await this.subirImagenS3(logoUrl);

                    this.$toast.success('Imagen registrada y subida con éxito');
                    this.limpiarData();
                } catch (error) {
                    console.error(error);
                    this.$toast.error('Hubo un error al subir la imagen');
                } finally {
                    this.loading = false;
                    this.cargaPorcentaje = false;
                    this.progresoCarga = 0;
                }
            },

            //Registrar el logo
            async registrarLogo() {
                const formData = new FormData();
                formData.append('nombre_logo', this.image.name);
                formData.append('rep_id', this.rep_id);

                const {
                    data
                } = await this.$axios.post('logo-rep-historia/crear-logo', formData);
                return data.url;
            },

            // Subir la imagen
            async subirImagenS3(urlData) {
                return await this.$axios.put(urlData.url, this.image, {
                    headers: {
                        'Content-Type': this.image.type
                    },
                    onUploadProgress: progressEvent => {
                        this.progresoCarga = Math.round((progressEvent.loaded * 100) / progressEvent
                            .total);
                    }
                });
            },

            async logoPorRep() {
                try {
                    const response = await this.$axios.get('logo-rep-historia/logo-por-rep/' + this.rep_id);
                    this.urlLogo = response.data.url;
                } catch (error) {
                    console.log(error);
                }
            }

        }
    }

</script>
