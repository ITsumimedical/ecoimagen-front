<template>
    <v-card flat>
        <v-container fluid>
            <v-alert color="primary" text dense icon="mdi-file-document-check-outline" border="left"><b>HISTORICO
                    BIOPSIAS AFILIADO</b></v-alert>

            <v-form ref="formBiopsia">
                <v-row>
                    <v-col cols="12" sm="4">
                        <v-autocomplete label="Tipos de documento" dense outlined :items="tiposDocumentos"
                            item-text="nombre" item-value="id" :loading="loading.tipo_documento"
                            v-model="consultar.tipo_documento" :rules="[rules.obligatorio]"></v-autocomplete>
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field label="Número de documento" dense outlined :loading="loading.tipo_documento"
                            v-model="consultar.numero_documento" :rules="[rules.obligatorio]"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4" sm="12" style="display: flex; gap: 0.2rem">
                        <v-btn color="primary" dark @click="consultarBiopsiasAfiliado()"
                            :loading="loading.consultarAfiliado" style="width: 49%">Consultar
                            <v-icon right>mdi-magnify</v-icon>
                        </v-btn>
                        <v-btn color="warning" dark @click="limpiarAfiliado()" style="width: 49%">Limpiar<v-icon right>
                                mdi-close
                            </v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>

        <v-col v-if="biopsiasRegistradas.length > 0">
            <template>
                <v-row justify="center">
                    <v-expansion-panels inset>
                        <v-expansion-panel v-for="(item, i) in biopsiasRegistradas" :key="i">
                            <v-expansion-panel-header @click="obtenerRegistroCancerAfiliado(item.id)"> Número de
                                registro: {{ item.id }} - Cie10 Asociado: {{ item.cie10.Codigo_Nombre
                                }}</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-col cols="12" sm="12" v-if="item.cie10?.tipo_cancer?.[0].id === 1">
                                    <CancerMama :cancerProp="cancer" :botonVisible="false"></CancerMama>
                                </v-col>
                                <v-col cols="12" sm="12" v-if="item.cie10?.tipo_cancer?.[0].id === 2">
                                    <CancerProstata :cancerProp="cancer" :botonVisible="false"></CancerProstata>
                                </v-col>
                                <v-col cols="12" sm="12" v-if="item.cie10?.tipo_cancer?.[0].id === 3">
                                    <cancerColon :cancerProp="cancer" :botonVisible="false"></cancerColon>
                                </v-col>
                                <v-col cols="12" sm="12" v-if="item.cie10?.tipo_cancer?.[0].id === 4">
                                    <cancerOvario :cancerProp="cancer" :botonVisible="false"></cancerOvario>
                                </v-col>
                                <v-col cols="12" sm="12" v-if="item.cie10?.tipo_cancer?.[0].id === 6">
                                    <cancerGastrico :cancerProp="cancer" :botonVisible="false"></cancerGastrico>
                                </v-col>
                                <v-col cols="12" sm="12" v-if="item.cie10?.tipo_cancer?.[0].id === 5">
                                    <cancerPulmon :cancerProp="cancer" :botonVisible="false"></cancerPulmon>
                                </v-col>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-row>
            </template>
        </v-col>
    </v-card>
</template>

<script>
import registroBiopsiaPatologias from "@/components/historia/formularios/ResultadoBiopsiaPatologia.vue";
import CancerMama from '@/components/historia/formularios/BiopsiaCancerMamaComponente.vue';
import CancerProstata from '@/components/historia/formularios/BiopsiaCancerProstata.vue';
import cancerColon from '@/components/historia/formularios/BiopsiaCancerColon.vue';
import cancerGastrico from '@/components/historia/formularios/BiopsiaCancerGastrico.vue';
import cancerPulmon from '@/components/historia/formularios/BiopsiaCancerPulmon.vue';
import cancerOvario from '@/components/historia/formularios/BiopsiaCancerOvario.vue';
export default {
    components: {
        registroBiopsiaPatologias,
        cancerColon,
        CancerProstata,
        cancerGastrico,
        cancerPulmon,
        CancerMama,
        cancerOvario
    },
    data() {
        return {
            tiposDocumentos: [],
            cancer: {},
            loading: {
                tipo_documento: false,
                consultarAfiliado: false
            },
            biopsiasRegistradas: [],
            rules: {
                obligatorio: (value) => !!value || "Este campo es obligatorio.",
            },
            consultar: {
                tipo_documento: null,
                numero_documento: null
            }
        }
    },

    mounted() {
        this.listarTiposDocumentos();
    },

    methods: {
        listarTiposDocumentos() {
            this.loading.tipo_documento = true;
            this.$axios
                .get("/tipo-documento/listar")
                .then((res) => {
                    this.tiposDocumentos = res.data;
                })
                .catch((error) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar los tipos de documento"
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.loading.tipo_documento = false;
                });
        },

        async consultarBiopsiasAfiliado() {
            if (!this.$refs.formBiopsia.validate()) return;
            try {
                this.loading.consultarAfiliado = true
                const { numero_documento, tipo_documento } = this.consultar;
                const response = await this.$axios.get(`registrar-biopsias/listar-historico-biopsias-afiliado/${numero_documento}/${tipo_documento}`);
                this.biopsiasRegistradas = response.data;
            } catch (error) {
                console.error('Error al consultar las biopsias del afiliado:', error);
            } finally {
                this.loading.consultarAfiliado = false
            }
        },

        limpiarAfiliado() {
            this.consultar = {},
                this.$refs.formBiopsia.resetValidation();
            this.biopsiasRegistradas = []
        },


        obtenerRegistroCancerAfiliado(biopsia) {
            this.$axios.get('registrar-biopsias/listar-registro-cancer-afiliado/' + biopsia).then((res) => {
                this.cancer = {
                    ...res.data,
                    fecha_ingreso_ihq: res.data.fecha_ingreso_ihq?.split(' ')[0] || '',
                    fecha_salida_ihq: res.data.fecha_salida_ihq?.split(' ')[0] || ''
                };
            }).catch((error) => {
                console.log(error)
            })
        }



    }
}
</script>