<template>
    <div>
        <v-row dense>
            <v-col cols="12" sm="12" md="12">
                <v-alert dense text color="blue-grey" border="left">
                    <v-row dense align="center">
                        <v-col class="grow">
                            <b>
                                3.1 IDENTIFICACIÓN DE CADA UNO DE LOS INTEGRANTES
                            </b>
                        </v-col>
                        <v-col class="shrink d-flex">
                            <v-btn dark small color="success" @click="abrirModalAgregarIntegrante()">
                                Agregar Integrante
                                <v-icon small right>mdi-account-plus</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-alert>
            </v-col>

            <v-col cols="12" sm="12" md="12">
                <v-data-table dense :loading="integrantes.loading" :items="integrantes.data"
                    loading-text="Cargando... Por favor espere" no-data-text="Sin datos para mostrar" show-expand
                    single-expand :headers="integrantes.headers">
                    <template v-slot:[`item.nombre_completo`]="{ item }">
                        {{ obtenerNombreCompleto(item) }}
                    </template>
                    <template v-slot:[`item.fecha_nacimiento`]="{ item }">
                        {{ $moment(item.fecha_nacimiento).format('DD-MM-YYYY') }}
                    </template>
                    <template v-slot:[`item.rol_familia`]="{ item }">
                        {{ item.rol_familia === 'Otro' ? item.rol_familia_otro : item.rol_familia }}
                    </template>
                    <template v-slot:[`item.acciones`]="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon dark color="error" v-bind="attrs" v-on="on" @click="eliminarIntegrante(item)">
                                    mdi-close-circle-outline
                                </v-icon>
                            </template>
                            <span>Eliminar</span>
                        </v-tooltip>
                    </template>
                    <template v-slot:expanded-item="{ item }">
                        <td class="pa-4 elevation-0" colspan="12">
                            <v-row dense>
                                <v-col cols="12" sm="12" md="6">
                                    <v-text-field dense outlined readonly label="EAPB" :value="item.entidad?.nombre" />
                                </v-col>
                                <v-col cols="12" sm="12" md="6">
                                    <v-text-field dense outlined readonly
                                        label="Pertenece a un grupo poblacional especial protección"
                                        :value="item.grupo_especial_proteccion" />
                                </v-col>
                                <v-col cols="12" sm="12" md="6">
                                    <v-text-field dense outlined readonly label="Pertenencia étnica"
                                        :value="item.pertenencia_etnica" />
                                </v-col>
                                <v-col cols="12" sm="12" md="6">
                                    <v-text-field dense outlined readonly label="Comunidad o pueblo indígena"
                                        :value="item.comunidad_pueblo_indigena ?? '-'" />
                                </v-col>
                                <v-col cols="12" sm="12" md="6">
                                    <v-text-field dense outlined readonly label="Reconoce alguna discapacidad"
                                        :value="item.discapacidad" />
                                </v-col>
                                <v-col cols="12" sm="12" md="6">
                                    <v-text-field dense outlined readonly
                                        label="El integrante de la familia presenta situaciones o condiciones de salud crónica"
                                        :value="parseInt(item.condiciones_salud_cronica) === 1 ? 'SI' : 'NO'" />
                                </v-col>
                            </v-row>
                        </td>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>

        <!-- Modal de agregar integrante -->
        <modal-agregar-integrante-familia :caracterizacion="caracterizacion"
            :mostrar-modal-agregar-integrante.sync="mostrarModalAgregarIntegrante" :rules="rules"
            @integranteAgregado="listarIntegrantes" />
    </div>
</template>
<script>
import { mapActions } from 'vuex';
import ModalAgregarIntegranteFamilia from '~/components/caracterizacion/caracterizacionEcis/modalAgregarIntegranteFamilia.vue';

export default {
    components: {
        ModalAgregarIntegranteFamilia
    },
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
            mostrarModalAgregarIntegrante: false,
            integrantes: {
                data: [],
                loading: false,
                headers: [
                    { text: 'Nombre', value: 'nombre_completo', align: 'center' },
                    { text: 'Tipo de Documento', value: 'tipo_documento.nombre', align: 'center' },
                    { text: 'Número de Documento', value: 'numero_documento', align: 'center' },
                    { text: 'Fecha de Nacimiento', value: 'fecha_nacimiento', align: 'center' },
                    { text: 'Sexo', value: 'sexo', align: 'center' },
                    { text: 'Rol dentro de la Familia', value: 'rol_familia', align: 'center' },
                    { text: 'Ocupación', value: 'ocupacion', align: 'center' },
                    { text: 'Nivel Educativo', value: 'nivel_educativo', align: 'center' },
                    { text: 'Régimen de Afiliación', value: 'tipo_afiliacion.nombre', align: 'center' },
                    { text: 'Acciones', value: 'acciones', align: 'center', 'sortable': false },
                ]
            }
        }
    },
    watch: {
        watch: {
            'caracterizacion.afiliado_id': {
                handler(nuevoValor, anteriorValor) {
                    if (nuevoValor && nuevoValor !== anteriorValor) {
                        this.listarIntegrantes();
                    }
                },
                immediate: true
            }
        }

    },
    mounted() {
        this.listarIntegrantes();
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        abrirModalAgregarIntegrante() {
            this.mostrarModalAgregarIntegrante = true;
        },

        async listarIntegrantes() {
            try {
                this.integrantes.loading = true;

                const { data } = await this.$axios.get(`/caracterizacion/listar-integrantes-familia/${this.caracterizacion.afiliado_id}`);
                this.integrantes.data = data;
            } catch (error) {
                this.$toast.error('Error al listar los integrantes de la familia');
            } finally {
                this.integrantes.loading = false;
            }
        },

        obtenerNombreCompleto(item) {
            return [
                item.primer_nombre,
                item.segundo_nombre,
                item.primer_apellido,
                item.segundo_apellido
            ].filter(Boolean).join(' ');
        },

        async eliminarIntegrante(integrante) {
            try {
                const { value } = await this.$swal({
                    title: '¿Está Seguro(a)?',
                    text: '¿Desea desvincular este integrante del afiliado?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#28a745',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar',
                });

                if (!value) return;

                this.setPreload(true);

                await this.$axios.delete(
                    `/caracterizacion/eliminar-integrante-familia-afiliado/${integrante.id}/${this.caracterizacion.afiliado_id}`
                );

                this.$toast.success('Integrante desvinculado correctamente');
                this.listarIntegrantes();

            } catch (error) {
                this.$toast.error('Error al desvincular el integrante');
            } finally {
                this.setPreload(false);
            }
        }


    }
}
</script>