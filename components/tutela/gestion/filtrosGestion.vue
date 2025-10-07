<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="2" sm="6">
                <v-text-field dense outlined append-icon="mdi-text-box-search-outline" label="N° Radicado"
                    v-model="filtro.radicado" @keyup.enter="enviarFiltro()"></v-text-field>
            </v-col>
            <v-col cols="12" md="2" sm="6">
                <v-text-field dense outlined append-icon="mdi-credit-card-search-outline" label="N° Documento"
                    v-model="filtro.cedula_paciente" @keyup.enter="enviarFiltro()"></v-text-field>
            </v-col>


            <v-col cols="12" md="2" sm="6">
                <v-menu dense v-model="menu.fechaInicio" :close-on-content-click="false" :nudge-right="40"
                    transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field dense outlined label="Fecha Inicial" append-icon="mdi-calendar" v-bind="attrs"
                            v-on="on" v-model="filtro.fecha_inicio"></v-text-field>
                    </template>
                    <v-date-picker v-model="filtro.fecha_inicio" @input="menu.fechaInicio = false"></v-date-picker>
                </v-menu>
            </v-col>
            
            <v-col cols="12" md="2" sm="6">
                <v-menu dense v-model="menu.fechaFin" :close-on-content-click="false" :nudge-right="40"
                transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field dense outlined label="Fecha Final" append-icon="mdi-calendar" v-bind="attrs"
                    v-on="on" v-model="filtro.fecha_fin"></v-text-field>
                </template>
                <v-date-picker v-model="filtro.fecha_fin" @input="menu.fechaFin = false"></v-date-picker>
            </v-menu>
        </v-col>
        <v-col cols="12" md="2" sm="6">
            <v-autocomplete dense outlined label="Municipio" item-text="nombre" item-value="id"
                v-model="filtro.municipio" :items="municipios"
                :loading="loading.municipios"></v-autocomplete>
        </v-col>

        <v-col cols="12" md="2" sm="6">
            <v-autocomplete dense outlined label="Entidad" item-text="nombre" item-value="id"
                v-model="filtro.entidad_id" :items="entidades" :loading="loading.entidades"></v-autocomplete>
        </v-col>

            <v-col cols="12" md="12" sm="12" align="right">
                <v-btn dark small color="warning" @click="enviarFiltro()">Limpiar
                    Filtros</v-btn>
                <v-btn dark small color="primary" @click="enviarFiltro()">Buscar</v-btn>
            </v-col>
            <v-col cols="12" md="12" sm="12">
                <v-divider></v-divider>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>
import { mapState, mapActions } from 'vuex';


export default ({
    data() {
        return {
            opcionesEntidad: [],
            loading: {
                entidades: false,
                municipios: false,
            },
            filtro: {
                cedula_paciente: null,
                entidad_id: null,
                radicado: null,
                municipio: null,
                fecha_inicio: null,
                fecha_fin: null,
                estado_id: null
            },
            menu: {
                fechaInicio: false,
                fechaFin: false,
            },
            info: {
                tipo_cierre: null,
                motivo: null,
                tutela_id: null,
                user_id: null
            }
        }

    },
    computed: {
        ...mapState('accionesConstitucionales',['municipios','entidades']),
    },
    mounted() {

        this.listarEntidades();
        this.listarMunicipio();
       

    },
    methods: {
        ...mapActions('accionesConstitucionales',['listarMunicipio', 'listarEntidades']),


        enviarFiltro() {
            this.$emit('listar-informacion', this.filtro)
            this.filtro = {
                cedula_paciente: null,
                entidad_id: null,
                radicado: null,
                municipio: null,
                fecha_inicio: null,
                fecha_fin: null,
            };
        },
        
        
        limpiarFiltro() {
            this.filtro = {
                cedula_paciente: null,
                entidad_id: null,
                radicado: null,
                municipio: null,
                estado_id: 23,
                fecha_inicio: null,
                fecha_fin: null
            };
        },
    }
})


</script>