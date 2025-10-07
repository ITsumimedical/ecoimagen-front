<template>
    <div>
        <v-card flat>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>Parametrización</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-tabs grow next-icon="mdi-arrow-right" prev-icon="mdi-arrow-left" show-arrows>
                    <v-tab> Barreras de Acceso </v-tab>
                    <v-tab-item>
                        <TipoBarreraAcceso></TipoBarreraAcceso>
                    </v-tab-item>
                    <v-tab> Area Responsable </v-tab>
                    <v-tab-item>
                        <v-card flat>
                            <v-card-text>
                                <AreaResponsebleBarrera></AreaResponsebleBarrera>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab> Responsable </v-tab>
                    <v-tab-item>
                        <v-card flat>
                            <v-card-text>
                                <ResponsableBarrera></ResponsableBarrera>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs>
            </v-card-text>
        </v-card>
    </div>
</template>
<script>
import AreaResponsebleBarrera from '~/components/barreraAcceso/parametrizacion/areaResponsebleBarrera.vue';
import ResponsableBarrera from '~/components/barreraAcceso/parametrizacion/responsableBarrera.vue';
import TipoBarreraAcceso from '~/components/barreraAcceso/parametrizacion/tipoBarreraAcceso.vue';

export default {
    components: {
        AreaResponsebleBarrera,
        ResponsableBarrera,
        TipoBarreraAcceso,
    }
}
</script>
