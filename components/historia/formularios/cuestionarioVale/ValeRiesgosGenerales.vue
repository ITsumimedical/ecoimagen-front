<template>
    <div>
        <v-alert color="info" text dense border="left" class="text-center" icon="mdi-human-male-male-child">
            <b>CUESTIONARIO VALE</b>
        </v-alert>

        <v-col cols="12" sm="12" md="12">
            <v-alert color="warning" text dense border="left" class="text-center" icon="mdi-information">
                <b>RIESGOS GENERALES (Condiciones perinatales y posnatales)</b>
            </v-alert>
        </v-col>

        <v-card-text>
            <v-row
                v-if="parseInt(this.datos.afiliado.edad_cumplida) >= 0 && parseInt(this.datos.afiliado.edad_cumplida) <= 18">
                <v-col cols="12" sm="12" md="12" class="d-flex align-center">
                    <span style="font-size: 17px;" class="mr-2"><b>Bajo peso al nacer (menor de 1500 gr)</b></span>
                    <v-col cols="12" sm="3" md="3">
                        <v-autocomplete outlined v-model="riesgos_generales.bajo_peso" :items="opciones"
                            label="Selecciona una opción" dense hide-details class="ml-2"
                            @change="emitirDatos"></v-autocomplete>
                    </v-col>
                </v-col>
                <v-col cols="12" sm="12" md="12" class="d-flex align-center">
                    <span style="font-size: 17px;" class="mr-2"><b>Nació antes de las 30 semanas de gestación (Prematuro
                            extremo)</b></span>
                    <v-col cols="12" sm="3" md="3">
                        <v-autocomplete outlined v-model="riesgos_generales.nacio_antes" :items="opciones"
                            label="Selecciona una opción" dense hide-details class="ml-2"
                            @change="emitirDatos"></v-autocomplete>
                    </v-col>
                </v-col>
                <v-col cols="12" sm="12" md="12" class="d-flex align-center">
                    <span style="font-size: 17px;" class="mr-2"><b>Estancia superior a 30 días en la unidad de cuidados
                            intensivos
                            o intermedios neonatales.</b></span>
                    <v-col cols="12" sm="3" md="3">
                        <v-autocomplete outlined v-model="riesgos_generales.estancia_superior" :items="opciones"
                            label="Selecciona una opción" dense hide-details class="ml-2"
                            @change="emitirDatos"></v-autocomplete>
                    </v-col>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="12" md="12" class="d-flex align-center">
                    <span style="font-size: 17px;" class="mr-2"><b>¿Antes, durante o poco después del nacimiento hubo
                            alguna
                            complicación? (escribir la descripción del padre o acudiente): </b></span>
                    <v-col cols="12" sm="3" md="3">
                        <v-autocomplete outlined v-model="riesgos_generales.complicaciones_bebe" :items="opciones"
                            label="Selecciona una opción" dense hide-details class="ml-2"
                            @change="emitirDatos"></v-autocomplete>
                    </v-col>
                </v-col>
                <v-col cols="12" sm="12" md="12" v-if="riesgos_generales.complicaciones_bebe == 'Sí'">
                    <v-textarea dense outlined label="Descripción de las complicaciones"
                        v-model="riesgos_generales.descripcion_complicaciones" auto-grow
                        @change="emitirDatos"></v-textarea>
                </v-col>

                <v-col cols="12" sm="12" md="12" class="d-flex align-center">
                    <span style="font-size: 17px;" class="mr-2"><b>¿El niño / niña ha sido diagnosticado(a) con alguna
                            condición
                            de salud? ¿cuál diagnóstico? (escribir el reporte del padre o acudiente) ¿Antes, durante o
                            poco después
                            del nacimiento hubo alguna
                            complicación? (escribir la descripción del padre o acudiente): </b></span>
                    <v-col cols="12" sm="3" md="3">
                        <v-autocomplete outlined v-model="riesgos_generales.bebe_diagnosticado" :items="opciones"
                            label="Selecciona una opción" dense hide-details class="ml-2"
                            @change="emitirDatos"></v-autocomplete>
                    </v-col>
                </v-col>

                <v-col cols="12" sm="12" md="12" v-if="riesgos_generales.bebe_diagnosticado == 'Sí'">
                    <v-textarea label="Descripción de los diagnosticos" dense outlined
                        v-model="riesgos_generales.descripcion_diagnosticos" @change="emitirDatos"></v-textarea>
                </v-col>

                <v-col cols="12" sm="12" md="12" class="d-flex align-center">
                    <span style="font-size: 17px;" class="mr-2"><b>¿Hay alguna condición de riesgo social (maltrato,
                            abandono,
                            otras) en la que se encuentre el niño? (escribir el reporte del padre o
                            acudiente)</b></span>
                    <v-col cols="12" sm="3" md="3">
                        <v-autocomplete outlined v-model="riesgos_generales.condicion_riesgo_social" :items="opciones"
                            label="Selecciona una opción" dense hide-details class="ml-2"
                            @change="emitirDatos"></v-autocomplete>
                    </v-col>
                </v-col>

                <v-col cols="12" sm="12" md="12" v-if="riesgos_generales.condicion_riesgo_social == 'Sí'">
                    <v-textarea label="Descripción de las condiciones de riesgo social" dense outlined
                        v-model="riesgos_generales.descripcion_riesgo_social" @change="emitirDatos"></v-textarea>
                </v-col>

                <v-col cols="12" sm="12" md="12" class="d-flex align-center">
                    <span style="font-size: 17px;" class="mr-2"><b>¿El niño presenta dificultades en el aprendizaje de
                            la lectura
                            y la escritura o en su desempeño escolar? (escribir el reporte del padre o
                            acudiente)</b></span>
                    <v-col cols="12" sm="3" md="3">
                        <v-autocomplete outlined v-model="riesgos_generales.dificultad_aprendizaje" :items="opciones"
                            label="Selecciona una opción" dense hide-details class="ml-2" item-text="text"
                            @change="emitirDatos"></v-autocomplete>
                    </v-col>

                </v-col>
                <v-col cols="12" sm="12" md="12" v-if="riesgos_generales.dificultad_aprendizaje == 'Sí'">
                    <v-textarea label="Descripción de las dificultades"
                        v-model="riesgos_generales.descripcion_dificultades" dense outlined auto-grow
                        @change="emitirDatos"></v-textarea>
                </v-col>
            </v-row>
        </v-card-text>

        <v-col></v-col>

    </div>
</template>


<script>
import condicionesEstructurales from "@/components/historia/formularios/cuestionarioVale/ValeCondicionesEstructurales.vue"
export default {
    components: {
        condicionesEstructurales
    },
    props: ['datos'],
    data() {
        return {
            riesgos_generales: {
                bajo_peso: '',
                nacio_antes: '',
                estancia_superior: '',
                complicaciones_bebe: '',
                descripcion_complicaciones: '',
                bebe_diagnosticado: '',
                descripcion_diagnosticos: '',
                condicion_riesgo_social: '',
                descripcion_riesgo_social: '',
                dificultad_aprendizaje: '',
                descripcion_dificultades: '',
                consulta_id: this.datos.id
            },
            opciones: ['Sí', 'No']
        }
    },
    computed: {
            conteoNo() {
                return Object.values(this.riesgos_generales).filter(valor => valor === 'Sí').length;
            }
        },
        watch: {
            conteoNo(newVal) {
                this.$emit('envioDatos', newVal);
            },
            riesgos_generales: {
                handler(nuevoValor) {
                    this.$emit('recibirRiesgosGenerales', nuevoValor);
                },
                deep: true,
                immediate: false
            },
        },

    mounted() {
        this.obtenerDatos()
    },

    methods: {
        emitirDatos() {
            this.$emit('envioDatos', this.riesgos_generales);
        },

        obtenerDatos() {
        this.$axios.get(`cuestionario-vale/obtenerDatos/${this.datos.afiliado.id}`).then(res => {
          this.riesgos_generales = {
            ...this.riesgos_generales,
            ...res.data
          };
        }).catch(error => {
          console.error('Error al obtener los datos:', error);
          this.$toast.error('Error al obtener los datos del cuestionario');
        });
      }

    }
}

</script>
