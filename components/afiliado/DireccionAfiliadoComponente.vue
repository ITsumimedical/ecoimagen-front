<template>
    <v-card>
        <v-alert dense text outlined color="blue-grey" icon="mdi-map-marker-account" class="text-center">
            <b>Registro de dirección del afiliado</b>
        </v-alert>

        <v-card-text>

            <v-container>
                <v-row>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete outlined dense :items="direccion_Residencia" v-model="direccion.calle"
                            hint="Ejemplo: Avenida, Calle" class="text-center" label="Ejemplo: Avenida, Calle">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <div class="text-center">
                            <v-text-field outlined dense hint="Número o letras antes del #" v-model="direccion.numero"
                                label="Número o letras antes del #"></v-text-field>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete outlined dense :items="orientacion" v-model="direccion.orientacion"
                            label="Observación">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <div class="text-subtitle-1 font-weight-medium">Númeral</div>
                        <div>{{ direccion.numeral }}</div>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field outlined dense v-model="direccion.primer_numero"
                            hint="Primer número después del #" label="Primer número después del #">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete outlined dense :items="letras" label="Letra" v-model="direccion.letra">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field outlined dense v-model="direccion.num_residencia" hint="Número residencia"
                            label="N° Residencia">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field outlined dense v-model="direccion.interior" hint="Interior" label="Interior">
                        </v-text-field>
                    </v-col>
                </v-row>
            </v-container>
            <v-card class="pa-3 mb-4" color="#f5f5f5" elevation="1">
                <v-row align="center">
                    <v-col cols="auto">
                        <v-avatar color="indigo" size="40">
                            <v-icon dark>mdi-map-marker</v-icon>
                        </v-avatar>
                    </v-col>
                    <v-col>
                        <div class="text-subtitle-2 font-weight-medium text--secondary">
                            Vista previa de dirección
                        </div>
                        <div class="text-body-2 mt-1 text--primary">
                            {{ direccionPrevia || 'Completa los campos para construir la dirección' }}
                        </div>
                    </v-col>
                </v-row>
            </v-card>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small dark color="error" @click="cerrarModal()">Salir</v-btn>
            <v-btn color="success" small @click="actualizarDireccion()">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
    props: {
        afiliado: {
            type: Number,
            required: true
        }
    },

    data() {
        return {
            direccion_Residencia: [
                'Autopista', 'Avenida', 'Avenida Calle', 'Avenida Carrera',
                'Calle', 'Carrera', 'Diagonal', 'Transversal',
            ],
            letras: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
                'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'],
            orientacion: ['SUR', 'ESTE', 'NORTE'],
            direccion: {
                calle: null,
                numero: null,
                orientacion: null,
                numeral: '#',
                primer_numero: null,
                letra: null,
                num_residencia: null,
                interior: null
            }
        }
    },

    computed: {
        direccionPrevia() {
            const partes = [
                this.direccion.calle,
                this.direccion.numero,
                this.direccion.orientacion,
                this.direccion.numeral,
                this.direccion.primer_numero,
                this.direccion.letra,
                this.direccion.num_residencia,
                this.direccion.interior
            ];
            return partes.filter(Boolean).join(' ');
        }
    },

    methods: {
        ...mapActions("app", ["setPreload"]),

        async actualizarDireccion() {
            try {
                this.setPreload(true);
                const nueva_direccion = this.direccionPrevia;

                if (this.afiliado) {
                    await this.$axios.put(`afiliados/actualizarDireccion/${this.afiliado}`, {
                        nueva_direccion
                    });
                    this.$toast.success('Dirección actualizada con éxito');
                    this.limpiarFormulario();
                } else {
                    this.$toast.info('Dirección registrada para nuevo afiliado');
                }

                this.$emit('direccionActualizada', nueva_direccion);
                this.cerrarModal();
            } catch (error) {
                console.error(error);
            } finally {
                this.setPreload(false);
            }
        },

        limpiarFormulario() {
            this.direccion = {
                calle: null,
                numero: null,
                orientacion: null,
                numeral: '#',
                primer_numero: null,
                letra: null,
                num_residencia: null,
                interior: null
            };
        },

        cerrarModal() {
            this.$emit('cerrarModal');
        }
    }
}
</script>
