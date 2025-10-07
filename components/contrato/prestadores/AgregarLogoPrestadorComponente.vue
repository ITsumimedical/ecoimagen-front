<template>
    <div>
        <v-card>
            <v-alert color="primary" text dense border="bottom">Agregar Logo A Las Sedes Del Prestador
                <b>{{ nombre_prestador }}</b></v-alert>
            <v-card-text>
                <v-col cols="12">
                    <v-file-input :rules="reglasImagen" outlined dense v-model="image" label="Seleccionar imagen"
                        append-icon="mdi-camera" accept="image/*" />
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
            prestador_id: {
                type: Number,
            },
            nombre_prestador: {
                type: String,
            },
        },
        data() {
            return {
                reglasImagen: [
                    file => {
                        if (!file) return true;
                        const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
                        return tiposPermitidos.includes(file.type) || 'El archivo debe ser una imagen válida';
                    }
                ],
                image: null,
                loading: false,
                cargaPorcentaje: false,
                progresoCarga: 0,
            }
        },

        methods: {
            limpiarData() {
                this.$emit('cerrar');
                this.image = null;
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
                formData.append('prestador_id', this.prestador_id);

                const {
                    data
                } = await this.$axios.post('logo-rep-historia/crear-logo-prestador', formData);
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

        }
    }

</script>
