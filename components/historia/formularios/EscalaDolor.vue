<template>
    <div>
        <v-form ref="formEscalaDolor" v-model="valid" lazy-validation>
            <v-alert text dense color="info" border="left" class="text-center" icon="mdi-emoticon-sick-outline">
                <b>ESCALA DEL DOLOR</b>
            </v-alert>
            <v-col class="d-flex justify-center">
                <strong>
                    Indica en qué escala se encuentra
                </strong>
            </v-col>
            <v-divider></v-divider>

            <v-col cols="12" sm="12" md="12" class="d-flex justify-center">
                <div class="d-flex">
                    <v-tooltip v-for="(color, index) in swatches" :key="index" top>
                        <template v-slot:activator="{ on }">
                            <div v-on="on" class="swatch-container">
                                <v-icon v-if="icons[index]" class="icon">{{ icons[index] }}</v-icon>
                                <div class="swatch" :style="{ backgroundColor: color }"
                                    :class="{ 'selected': selectedColor === color }" @click="escalaSeleccionada(color)">
                                </div>
                            </div>
                        </template>
                        <span>{{ tooltips[index] }}</span>
                    </v-tooltip>
                </div>
            </v-col>
            <v-col cols="12" sm="12" md="12" v-if="error">
                <v-alert type="error" dense text>La escala del dolor es requerida</v-alert>
            </v-col>
            <v-alert v-if="selectedColor && tooltipSeleccionado" text dense :color="selectedColor" border="left"
                class="text-center" icon="mdi-information">
                <b>Descripción seleccionada</b><br>
                {{ tooltipSeleccionado }}
            </v-alert>

        </v-form>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: "EscalaDelDolor",
    props: ['datos'],
    data() {
        return {
            swatches: ['#1B5E20', '#81C784', '#EEFF41', '#FB8C00', '#E65100', '#D50000'],
            tooltips: ['Sin dolor', 'Dolor leve', 'Dolor moderado', 'Dolor intenso', 'Dolor muy intenso',
                'Dolor insoportable'
            ],
            icons: ['mdi-emoticon-happy-outline', 'mdi-emoticon-neutral-outline', 'mdi-emoticon-sad-outline',
                'mdi-emoticon-cry-outline', 'mdi-emoticon-cry', 'mdi-emoticon-dead-outline'
            ],
            selectedColor: null,
            tooltipSeleccionado: null,
            escalaAnterior: null,
            loading: false,
            error: false,
            valid: false
        };
    },

    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),

    },

    mounted() {
        const escalaDolor = this.obtenerDatosPorConsulta(this.datos.id, 'EscalaDolor/Model/EscalaDolor', 'historia/formularios/EscalaDolor');

        if (escalaDolor) {
            this.selectedColor = escalaDolor.color_escala;
            this.tooltipSeleccionado = escalaDolor.descripcion;
        } else {
            this.obtenerDatosAnteriores();
        }
    },
    methods: {
        obtenerDatos() {
            const data = {
                color_escala: this.selectedColor,
                descripcion: this.tooltipSeleccionado,
                consulta_id: this.datos.id
            }
            return { modelo: "EscalaDolor", datos: data };
        },
        escalaSeleccionada(color) {
            this.selectedColor = color; // Asigna el color seleccionado
            const colorSeleccionado = this.swatches.indexOf(color); // Obtén el índice del color
            this.tooltipSeleccionado = this.tooltips[colorSeleccionado]; // Asigna el tooltip correspondiente
            this.error = false;
        },

        guardar() {
            const data = {
                color_escala: this.selectedColor,
                descripcion: this.tooltipSeleccionado,
                consulta_id: this.datos.id
            };
            this.loading = true;
            this.$axios.post('escalaDolor/crear', data).then(() => {
                this.$toast.success('Agregado con éxito')
                this.obtenerDatosAnteriores();
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                this.loading = false;
            })
        },

        obtenerDatosAnteriores() {
            this.$axios.get(`escalaDolor/obtenerDatos/${this.datos.afiliado.id}`).then((res) => {
                this.selectedColor = res.data.color_escala;
                this.tooltipSeleccionado = res.data.descripcion
            }).catch((error) => {
                console.log(error);
            });
        },

        validarErrores() {
            if (!this.selectedColor) {
                this.error = true;
                this.$refs.formEscalaDolor.validate();
                return false;
            } else {
                this.error = false;
                return true;
            }
        },
    }
};

</script>

<style scoped>
.text-center {
    text-align: center;
}

.swatch-container {
    display: flex;
    align-items: center;
    margin: 0 8px;
    cursor: pointer;
}

.swatch {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-left: 8px;
    transition: border 0.3s ease;
    /* Transición suave para el borde */
}

.swatch.selected {
    border: 3px solid #000;
    /* Borde negro para resaltar el color seleccionado */
}

.icon {
    margin-right: 8px;
}
</style>
