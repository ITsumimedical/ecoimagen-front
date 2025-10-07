<template>
    <div>
        <v-card>
            <v-alert
                text
                dense
                border="left"
                type="info"
                :icon="false"
                class="text-center"
            >
                <b>MÓDULO DE PARAMETRIZACIÓN COMPRAS</b>
            </v-alert>

            <v-tabs v-model="tab" grow>
                <v-tab key="areas">Áreas</v-tab>
                <v-tab key="lineas">Líneas</v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
                <v-tab-item key="areas">
                    <v-card flat>
                        <v-card-text>
                            <AreasComprasComponent />
                        </v-card-text>
                    </v-card>
                </v-tab-item>

                <v-tab-item key="lineas">
                    <v-card flat>
                        <v-card-text>
                            <LineasComprasComponent />
                        </v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </v-card>
    </div>
</template>

<script>
import AreasComprasComponent from "@/components/compras/AreasComprasComponent.vue";
import LineasComprasComponent from "@/components/compras/LineasComprasComponent.vue";

export default {
    components: {
        AreasComprasComponent,
        LineasComprasComponent,
    },
    data() {
        return {
            tab: null,
        };
    },
};
</script>
