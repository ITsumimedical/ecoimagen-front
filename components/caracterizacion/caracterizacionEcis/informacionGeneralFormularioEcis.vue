<template>
    <v-form ref="form" class="my-2">
        <v-row dense>
            <v-col cols="12" sm="12" md="12">
                <v-alert dense text color="blue-grey" border="left">
                    <b>
                        1.1 DATOS GENERALES DEL ESCENARIO DEL ENTORNO QUE SE CARACTERIZA
                    </b>
                </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-text-field dense outlined label="Unidad Zonal de Planeación y Evaluación - Regional - Provincia *"
                    :rules="[rules.obligatorio]" v-model="caracterizacion.unidad_zonal_planeacion_evaluacion" />
            </v-col>
            <v-col cols="12" sm="12" md="6">
                <v-autocomplete dense outlined label="Departamento *" :loading="departamentos.loading"
                    v-model="caracterizacion.dpto_residencia_id" :items="departamentos.opciones" item-text="nombre"
                    @change="listarOpcionesMunicipios" item-value="id" :rules="[rules.obligatorio]" />
            </v-col>
            <v-col cols="12" sm="12" md="6">
                <v-autocomplete dense outlined label="Municipio / Área no Municipalizada *" :items="municipios.opciones"
                    item-text="nombre" :loading="municipios.loading" item-value="id"
                    v-model="caracterizacion.mpio_residencia_id" :rules="[rules.obligatorio]"
                    :disabled="!caracterizacion.dpto_residencia_id" />
            </v-col>
            <v-col cols="12" sm="6" md="6">
                <v-text-field dense outlined label="Territorio *" :rules="[rules.obligatorio]"
                    v-model="caracterizacion.territorio_nombre" />
            </v-col>
            <v-col cols="12" sm="3" md="3">
                <v-text-field dense outlined label="ID Territorio *" :rules="[rules.obligatorio]"
                    v-model="caracterizacion.territorio_id" />
            </v-col>
            <v-col cols="12" sm="3" md="3">
                <v-text-field dense outlined label="Serial Territorio *" :rules="[rules.obligatorio]"
                    v-model="caracterizacion.territorio_serial" />
            </v-col>
            <v-col cols="12" sm="6" md="6">
                <v-text-field dense outlined label="Microterritorio *" :rules="[rules.obligatorio]"
                    v-model="caracterizacion.microterritorio_nombre" />
            </v-col>
            <v-col cols="12" sm="3" md="3">
                <v-text-field dense outlined label="ID Microterritorio *" :rules="[rules.obligatorio]"
                    v-model="caracterizacion.microterritorio_id" />
            </v-col>
            <v-col cols="12" sm="3" md="3">
                <v-text-field dense outlined label="Serial Microterritorio *" :rules="[rules.obligatorio]"
                    v-model="caracterizacion.microterritorio_serial" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-text-field dense outlined
                    label="Corregimiento / Centro del Poblado / Vereda / Localidad / Barrrio / Resguardo Indígena *"
                    :rules="[rules.obligatorio]" v-model="caracterizacion.direccion_residencia_barrio" />
            </v-col>
            <v-col cols="12" sm="12" md="8">
                <v-text-field dense outlined label="Dirección *" :rules="[rules.obligatorio]"
                    v-model="caracterizacion.direccion_residencia_cargue" />
            </v-col>
            <v-col cols="12" sm="12" md="4">
                <v-text-field dense outlined label="Geopunto (Online y Offline) y Altitud *"
                    :rules="[rules.obligatorio]" v-model="caracterizacion.geopunto" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-text-field dense outlined
                    label="Ubicación del Hogar (Cuando no se cuenta con nomenclatura, punto de referencia) *"
                    :rules="[rules.obligatorio]" v-model="caracterizacion.ubicacion_hogar" />
            </v-col>
            <v-col cols="12" sm="12" md="8">
                <v-text-field dense outlined label="N° de Identificación de la Familia *" :rules="[rules.obligatorio]"
                    v-model="caracterizacion.numero_identificacion_familia" />
            </v-col>
            <v-col cols="12" sm="12" md="4">
                <v-select dense outlined label="Estrato Socioeconómico de la Vivienda *" :items="estrato.opciones"
                    v-model="caracterizacion.estrato" :rules="[rules.obligatorio]" />
            </v-col>
            <v-col cols="12" sm="12" md="4">
                <v-text-field dense outlined type="number" min="0" label="N° de Hogares en la Vivienda *"
                    :rules="[rules.obligatorio]" v-model="caracterizacion.numero_hogares_vivienda" />
            </v-col>
            <v-col cols="12" sm="12" md="4">
                <v-text-field dense outlined type="number" min="0" label="N° de Familias en la Vivienda *"
                    :rules="[rules.obligatorio]" v-model="caracterizacion.numero_familias_vivienda" />
            </v-col>
            <v-col cols="12" sm="12" md="4">
                <v-text-field dense outlined type="number" min="0" label="N° de Personas en la Vivienda *"
                    :rules="[rules.obligatorio]" v-model="caracterizacion.numero_personas_vivienda" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-alert dense text color="blue-grey" border="left">
                    <b>
                        1.2 IDENTIFICACIÓN DEL ENCUESTADOR
                    </b>
                </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-text-field dense outlined label="N° de Identificación del Equipo Básico de Salud (EBS) *"
                    :rules="[rules.obligatorio]" v-model="caracterizacion.numero_identificacion_ebs" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-autocomplete dense outlined label="Prestador primario / Organismo de adscripción del EBS *"
                    no-data-text="Digite el NIT del Prestador para iniciar la búsqueda." :loading="prestadores.loading"
                    :items="prestadores.opciones" :rules="[rules.obligatorio]" v-model="caracterizacion.prestador_id"
                    :search-input.sync="prestadores.campoBusqueda" item-text="text" item-value="value" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-text-field dense outlined
                    label="Responsable de la Evaluación de Necesidades en Salud - Caracterización *"
                    v-model="caracterizacion.responsable_evaluacion_necesidades" :rules="[rules.obligatorio]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-textarea auto-grow dense outlined
                    label="Perfil de quien Realiza la Evaluación de Necesidades en Salud - Caracterización"
                    v-model="caracterizacion.perfil_evaluacion_necesidades"
                    :rules="[rules.obligatorio, rules.minCaracteres]" />
            </v-col>
            <v-col cols="12" sm="12" md="6">
                <v-text-field dense outlined label="Código de la Ficha *" v-model="caracterizacion.codigo_ficha"
                    :rules="[rules.obligatorio]" />
            </v-col>
            <v-col cols="12" sm="12" md="6">
                <v-menu dense v-model="menu.fecha_diligenciamiento_ficha" :close-on-content-click="false"
                    :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="caracterizacion.fecha_diligenciamiento_ficha" label="Fecha Inicial *"
                            :rules="[rules.obligatorio]" prepend-icon="" append-icon="mdi-calendar" readonly dense
                            v-bind="attrs" v-on="on" outlined></v-text-field>
                    </template>
                    <v-date-picker v-model="caracterizacion.fecha_diligenciamiento_ficha"
                        @input="menu.fecha_diligenciamiento_ficha = false"></v-date-picker>
                </v-menu>
            </v-col>
        </v-row>
    </v-form>
</template>
<script>
export default {
    props: {
        caracterizacion: {
            type: Object,
            default: null
        },
        rules: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            departamentos: {
                opciones: [],
                loading: false
            },
            municipios: {
                opciones: [],
                loading: false
            },
            estrato: {
                opciones: [
                    { text: '1 - Bajo - Bajo', value: '1' },
                    { text: '2 - Bajo', value: '2' },
                    { text: '3 - Medio - Bajo', value: '3' },
                    { text: '4 - Medio', value: '4' },
                    { text: '5 - Medio - Alto', value: '5' },
                    { text: '6 - Alto', value: '6' },
                ]
            },
            menu: {
                fecha_diligenciamiento_ficha: false
            },
            prestadores: {
                opciones: [],
                loading: false,
                campoBusqueda: null
            }
        }
    },
    mounted() {
        this.listarOpcionesDepartamentos().then(() => {
            if (this.caracterizacion.dpto_residencia_id) {
                this.listarOpcionesMunicipios();
            }
        });
    },
    watch: {
        'prestadores.campoBusqueda'(nuevoValor) {
            if (nuevoValor && nuevoValor.length === 5) {
                this.buscarOpcionesPrestador();
            }
        }
    },
    methods: {
        async listarOpcionesDepartamentos() {
            try {
                this.departamentos.loading = true;
                const { data } = await this.$axios.get('/departamento');
                this.departamentos.opciones = data;
            } catch (error) {
                this.$toast.error('Error al listar los departamentos');
            } finally {
                this.departamentos.loading = false;
            }
        },

        async listarOpcionesMunicipios() {
            try {
                this.municipios.loading = true;

                const { data } = await this.$axios.get(`/municipios/listar-municipios-por-departamentos`,{
                    params: {
                        departamento_id: this.caracterizacion.dpto_residencia_id
                    }
                });

                this.municipios.opciones = data;


            } catch (error) {
                this.$toast.error('Error al listar los municipios');
            } finally {
                this.municipios.loading = false;
            }
        },

        async buscarOpcionesPrestador() {
            try {
                this.prestadores.loading = true;

                const { data } = await this.$axios.post(`/prestador/buscarPrestador`,{
                    nit: this.prestadores.campoBusqueda
                });

                this.prestadores.opciones = data.map(prestador => {
                    return {
                        text: `${prestador.nit} - ${prestador.nombre_prestador}`,
                        value: prestador.id
                    }
                });

            } catch (error) {
                this.$toast.error('Error al listar los prestadores');
            } finally {
                this.prestadores.loading = false;
            }
        }
    }

}
</script>