<template>
    <v-row dense>
        <v-col cols="12" sm="12" md="12">
            <v-data-table dense :headers="headers" :items="adjuntos" no-data-text="Sin datos para mostrar">

                <template v-slot:[`item.fechaCreacion`]="{ item }">
                    <td class="text-center">
                        {{ $moment(item.created_at).format('DD/MM/YYYY') }}
                    </td>
                </template>
                <template v-slot:[`item.acciones`]="{ item }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon color="primary" v-bind="attrs" v-on="on" @click="consultarAdjunto(item)">
                                mdi-file-download
                            </v-icon>
                        </template>
                        <span>Descargar</span>
                    </v-tooltip>
                </template>
            </v-data-table>
        </v-col>
    </v-row>
</template>
<script>
import { mapActions } from "vuex";

export default {
    props: {
        adjuntos: {
            type: Array,
            default: () => ([])
        }
    },
    data() {
        return {
            headers: [
                { text: 'Archivo', value: 'nombre', align: 'center' },
                { text: 'Fecha', value: 'fechaCreacion', align: 'center' },
                { text: 'Acciones', value: 'acciones', align: 'center' },
            ]
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        async consultarAdjunto(item) {
            try {
                this.setPreload(true); // Activa el indicador de carga

                let adj = await this.$adjuntos(item.ruta);

                console.log("Adjunto", adj);
                // Validar si adj no existe
                if (!adj || adj[1].byteLength <= 0) {
                    console.log('Adjunto no encontrado, intentando descargar de digital...');
                    return await this.descargaAdjuntoDigital(item);
                }

                console.log("Adjunto", adj);

                let blob = new Blob([adj[1]], {
                    type: adj[0],
                });

                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                console.error('Error en consultarAdjunto:', error);
                // Si ocurre un error, también intenta descargar de digital
                return await this.descargaAdjuntoDigital(item);
            } finally {
                this.setPreload(false); // Desactiva el indicador de carga
            }
        },

        async descargaAdjuntoDigital(item) {
            try {
                this.setPreload(true); // Activa el indicador de carga

                const data = {
                    disco: 'digital',
                    path: item.ruta,
                    tiempo: 10,
                };

                const urlDescarga = await this.$axios.post(
                    '/adjuntos/generar-url-temporal-consulta',
                    data
                );

                if (urlDescarga?.data) {
                    // Abrir la descarga en otra pestaña
                    window.open(urlDescarga.data, "_blank");
                } else {
                    this.$toast.error('No se obtuvo una URL válida para la descarga');
                }
            } catch (error) {
                console.error('Error en descargaAdjuntoDigital:', error);
                this.$toast.error('Ocurrió un error al descargar el archivo');
            } finally {
                this.setPreload(false); // Desactiva el indicador de carga
            }
        },
    }
}
</script>
