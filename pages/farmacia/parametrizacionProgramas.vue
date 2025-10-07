<template>
    <v-card>

        <v-card-title>
            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                        <span>PARAMETRIZACIÓN</span>
                    </div>
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
            </v-toolbar>
        </v-card-title>


        <v-tabs grow>
            <v-tab>
                <v-icon left color="indigo">mdi-calendar-multiselect</v-icon>
                Programas
            </v-tab>
            <v-tab>
                <v-icon left color="blue-grey">mdi-cog-outline</v-icon>
                Parametrización productos
            </v-tab>
            <v-tab>
                <v-icon left color="teal darken-1">mdi-medical-bag</v-icon>
                Bodega medicamentos
            </v-tab>
            <v-tab>
                <v-icon left color="brown darken-1">mdi-warehouse</v-icon>
                Bodegas
            </v-tab>
            <v-tab>
                <v-icon left color="deep-purple accent-4">mdi-pill</v-icon>
                Códigos LASA
            </v-tab>

            <v-tab-item>
                <v-card flat>
                    <ProgramasFarmacia />
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card flat>
                    <parametrizacionProductos />
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card flat>
                    <bodegaMedicamentos />
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card flat>
                    <bodegas />
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card flat>
                    <codigosLasa />
                </v-card>
            </v-tab-item>
        </v-tabs>
    </v-card>
</template>

<script>
import ProgramasFarmacia from '@/components/farmacia/ProgramasFarmacia/ProgramasFarmacia.vue';
import parametrizacionProductos from '@/pages/codigosSumi/codigoSumi.vue';
import bodegaMedicamentos from '@/pages/farmacia/bodegaMedicamentos.vue';
import codigosLasa from "@/pages/farmacia/codigosLasa.vue";
import bodegas from "@/pages/farmacia/bodegas.vue"

export default {
    name: 'programasFarmacia',
    components: {
        ProgramasFarmacia,
        parametrizacionProductos,
        bodegaMedicamentos,
        codigosLasa,
        bodegas
    },
    data() {
        return {
            tab: null,
        };
    },
};
</script>
