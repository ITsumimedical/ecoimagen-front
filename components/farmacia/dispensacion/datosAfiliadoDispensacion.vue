<template>
    <v-row dense>
        <v-col cols="12" sm="12" md="12">
            <v-alert text dense border="left" :color="getColorEntidad(afiliado?.entidad.id)" icon="mdi-account"
                class="text-center">
                <b>Información del Afiliado</b>
            </v-alert>
        </v-col>
        <v-col cols="12" sm="3" md="3">
            <span>
                <b class="text-subtitle-1 font-weight-bold">Entidad</b>
                <br />
                <p class="text-body-1"><v-chip :color="getColorEntidad(afiliado?.entidad.id)">{{
                    afiliado?.entidad?.nombre }}</v-chip></p>
            </span>
        </v-col>
        <v-col cols="12" sm="3" md="3">
            <span>
                <b class="text-subtitle-1 font-weight-bold">Nombre Completo</b>
                <br />
                <p class="text-body-1">
                    {{
                        `${afiliado?.primer_nombre || ''} ${afiliado?.segundo_nombre || ''} ${afiliado?.primer_apellido || ''} ${afiliado?.segundo_apellido || ''}`.trim() || 'Sin nombre'
                    }}
                </p>
            </span>
        </v-col>
        <v-col cols="12" sm="3" md="3">
            <span>
                <b class="text-subtitle-1 font-weight-bold">Tipo de Documento</b>
                <br />
                <p class="text-body-1">{{ afiliado?.tipo_documento?.nombre }}</p>
            </span>
        </v-col>
        <v-col cols="12" sm="3" md="3">
            <span>
                <b class="text-subtitle-1 font-weight-bold">Número de Documento</b>
                <br />
                <p class="text-body-1">{{ afiliado?.numero_documento }}</p>
            </span>
        </v-col>
        <v-col cols="12" sm="3" md="3">
            <span>
                <b class="text-subtitle-1 font-weight-bold">Sede de Atención</b>
                <br />
                <p class="text-body-1">{{ afiliado?.ips?.nombre }}</p>
            </span>
        </v-col>
        <v-col cols="12" sm="3" md="3">
            <span>
                <b class="text-subtitle-1 font-weight-bold">Edad Cumplida</b>
                <br />
                <p class="text-body-1">{{ afiliado?.edad_cumplida }} Años</p>
            </span>
        </v-col>
        <v-col cols="12" sm="3" md="3">
            <span>
                <b class="text-subtitle-1 font-weight-bold">Teléfono</b>
                <br />
                <p class="text-body-1">{{ afiliado?.telefono }}</p>
            </span>
        </v-col>
        <v-col cols="12" sm="3" md="3">
            <span>
                <b class="text-subtitle-1 font-weight-bold">Dirección</b>
                <br />
                <p class="text-body-1">{{ afiliado?.direccion }}</p>
            </span>
        </v-col>
        <v-col cols="12" sm="3" md="3" v-for="item in afiliado?.clasificacion" :key="item.id">
            <v-chip dark color="primary" label>
                {{ item.nombre }}
            </v-chip>
        </v-col>
    </v-row>
</template>
<script>
export default {
    props: {
        afiliado: {
            type: Object,
            required: true,
        },
    },


    methods: {
        getColorEntidad(entidadId) {
            switch (entidadId) {
                case 1:
                    return "primary";
                case 3:
                    return "success";
                default:
                    return "warning";
            }
        }

    }
};
</script>
