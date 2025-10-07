<template>
    <div>
        <v-alert color="warning" text dense border="left" class="text-center" icon="mdi-information">
            <b>CONDICIONES ESTRUCTURALES</b>
        </v-alert>
        <br>
        <v-row>
            <v-col cols="12" sm="12" md="12">
                <v-card class="pa-4 mx-auto" max-width="800" elevation="3" outlined>
                    <v-simple-table class="tabla-compacta" dense>
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-center" rowspan="2" style="width: 40%;">ÓRGANOS Y SISTEMAS</th>
                                    <th class="text-center" colspan="2">PRESENCIA</th>
                                    <th class="text-center" colspan="2">INTEGRIDAD</th>
                                    <th class="text-center" rowspan="2" style="width: 20%;"></th>
                                </tr>
                                <tr>
                                    <th class="text-center" style="width: 5%;">SI</th>
                                    <th class="text-center" style="width: 5%;">NO</th>
                                    <th class="text-center" style="width: 5%;">SI</th>
                                    <th class="text-center" style="width: 5%;">NO</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <!-- OREJAS -->
                                    <td class="text-center">
                                        <div class="componente-item">OREJAS</div>
                                    </td>
                                    <td class="text-center">
                                        <input :disabled="desactivarBotones" v-model="condiciones_estructurales.orejas"
                                            type="radio" name="presencia-orejas" value="SI" />
                                    </td>
                                    <td class="text-center">
                                        <input :disabled="desactivarBotones" v-model="condiciones_estructurales.orejas"
                                            type="radio" name="presencia-orejas" value="NO" />
                                    </td>
                                    <td class="text-center">
                                        <input
                                            :disabled="desactivarBotones || condiciones_estructurales.orejas === 'NO'"
                                            v-model="condiciones_estructurales.integridad_orejas" type="radio"
                                            name="integridad-orejas" value="SI" />
                                    </td>
                                    <td class="text-center">
                                        <input
                                            :disabled="desactivarBotones || condiciones_estructurales.orejas === 'NO'"
                                            v-model="condiciones_estructurales.integridad_orejas" type="radio"
                                            name="integridad-orejas" value="NO" />
                                    </td>
                                </tr>
                                <!-- LABIOS -->
                                <tr>
                                    <td class="text-center">
                                        <div class="componente-item">LABIOS</div>
                                    </td>
                                    <td class="text-center">
                                        <input :disabled="desactivarBotones" v-model="condiciones_estructurales.labios"
                                            type="radio" name="presencia-labios" value="SI" />
                                    </td>
                                    <td class="text-center">
                                        <input :disabled="desactivarBotones" v-model="condiciones_estructurales.labios"
                                            type="radio" name="presencia-labios" value="NO" />
                                    </td>
                                    <td class="text-center">
                                        <input
                                            :disabled="desactivarBotones || condiciones_estructurales.labios === 'NO'"
                                            v-model="condiciones_estructurales.integridad_labios" type="radio"
                                            name="integridad-labios" value="SI" />
                                    </td>
                                    <td class="text-center">
                                        <input
                                            :disabled="desactivarBotones || condiciones_estructurales.labios === 'NO'"
                                            v-model="condiciones_estructurales.integridad_labios" type="radio"
                                            name="integridad-labios" value="NO" />
                                    </td>
                                </tr>
                                <!-- LENGUA -->
                                <tr>
                                    <td class="text-center">
                                        <div class="componente-item">LENGUA</div>
                                    </td>
                                    <td class="text-center">
                                        <input :disabled="desactivarBotones" v-model="condiciones_estructurales.lengua"
                                            type="radio" name="presencia-lengua" value="SI" />
                                    </td>
                                    <td class="text-center">
                                        <input :disabled="desactivarBotones" v-model="condiciones_estructurales.lengua"
                                            type="radio" name="presencia-lengua" value="NO" />
                                    </td>
                                    <td class="text-center">
                                        <input
                                            :disabled="desactivarBotones || condiciones_estructurales.lengua === 'NO'"
                                            v-model="condiciones_estructurales.integridad_lengua" type="radio"
                                            name="integridad-lengua" value="SI" />
                                    </td>
                                    <td class="text-center">
                                        <input
                                            :disabled="desactivarBotones || condiciones_estructurales.lengua === 'NO'"
                                            v-model="condiciones_estructurales.integridad_lengua" type="radio"
                                            name="integridad-lengua" value="NO" />
                                    </td>
                                </tr>
                                <!-- NARIZ -->
                                <tr>
                                    <td class="text-center">
                                        <div class="componente-item">NARIZ</div>
                                    </td>
                                    <td class="text-center">
                                        <input :disabled="desactivarBotones" v-model="condiciones_estructurales.nariz"
                                            type="radio" name="presencia-nariz" value="SI" />
                                    </td>
                                    <td class="text-center">
                                        <input :disabled="desactivarBotones" v-model="condiciones_estructurales.nariz"
                                            type="radio" name="presencia-nariz" value="NO" />
                                    </td>
                                    <td class="text-center">
                                        <input :disabled="desactivarBotones || condiciones_estructurales.nariz === 'NO'"
                                            v-model="condiciones_estructurales.integridad_nariz" type="radio"
                                            name="integridad-nariz" value="SI" />
                                    </td>
                                    <td class="text-center">
                                        <input :disabled="desactivarBotones || condiciones_estructurales.nariz === 'NO'"
                                            v-model="condiciones_estructurales.integridad_nariz" type="radio"
                                            name="integridad-nariz" value="NO" />
                                    </td>
                                </tr>
                                <!-- PALADAR -->
                                <tr>
                                    <td class="text-center">
                                        <div class="componente-item">PALADAR</div>
                                    </td>
                                    <td class="text-center">
                                        <input :disabled="desactivarBotones" v-model="condiciones_estructurales.paladar"
                                            type="radio" name="presencia-paladar" value="SI" />
                                    </td>
                                    <td class="text-center">
                                        <input :disabled="desactivarBotones" v-model="condiciones_estructurales.paladar"
                                            type="radio" name="presencia-paladar" value="NO" />
                                    </td>
                                    <td class="text-center">
                                        <input
                                            :disabled="desactivarBotones || condiciones_estructurales.paladar === 'NO'"
                                            v-model="condiciones_estructurales.integridad_paladar" type="radio"
                                            name="integridad-paladar" value="SI" />
                                    </td>
                                    <td class="text-center">
                                        <input
                                            :disabled="desactivarBotones || condiciones_estructurales.paladar === 'NO'"
                                            v-model="condiciones_estructurales.integridad_paladar" type="radio"
                                            name="integridad-paladar" value="NO" />
                                    </td>
                                </tr>
                                <!-- OJOS -->
                                <tr>
                                    <td class="text-center">
                                        <div class="componente-item">OJOS</div>
                                    </td>
                                    <td class="text-center">
                                        <input :disabled="desactivarBotones" v-model="condiciones_estructurales.ojos"
                                            type="radio" name="presencia-ojos" value="SI" />
                                    </td>
                                    <td class="text-center">
                                        <input :disabled="desactivarBotones" v-model="condiciones_estructurales.ojos"
                                            type="radio" name="presencia-ojos" value="NO" />
                                    </td>
                                    <td class="text-center">
                                        <input :disabled="desactivarBotones || condiciones_estructurales.ojos === 'NO'"
                                            v-model="condiciones_estructurales.integridad_ojos" type="radio"
                                            name="integridad-ojos" value="SI" />
                                    </td>
                                    <td class="text-center">
                                        <input :disabled="desactivarBotones || condiciones_estructurales.ojos === 'NO'"
                                            v-model="condiciones_estructurales.integridad_ojos" type="radio"
                                            name="integridad-ojos" value="NO" />
                                    </td>
                                </tr>
                                <!-- DIENTES -->
                                <tr>
                                    <td class="text-center">
                                        <div class="componente-item">DIENTES (acorde a la edad)</div>
                                    </td>
                                    <td class="text-center">
                                        <input :disabled="desactivarBotones" v-model="condiciones_estructurales.dientes"
                                            type="radio" name="presencia-dientes" value="SI" />
                                    </td>
                                    <td class="text-center">
                                        <input :disabled="desactivarBotones" v-model="condiciones_estructurales.dientes"
                                            type="radio" name="presencia-dientes" value="NO" />
                                    </td>
                                    <td class="text-center">
                                        <input
                                            :disabled="desactivarBotones || condiciones_estructurales.dientes === 'NO'"
                                            v-model="condiciones_estructurales.integridad_dientes" type="radio"
                                            name="integridad-dientes" value="SI" />
                                    </td>
                                    <td class="text-center">
                                        <input
                                            :disabled="desactivarBotones || condiciones_estructurales.dientes === 'NO'"
                                            v-model="condiciones_estructurales.integridad_dientes" type="radio"
                                            name="integridad-dientes" value="NO" />
                                    </td>
                                </tr>
                                <!-- CUELLO -->
                                <tr>
                                    <td class="text-center">
                                        <div class="componente-item">CUELLO</div>
                                    </td>
                                    <td class="text-center">
                                        <input :disabled="desactivarBotones" v-model="condiciones_estructurales.cuello"
                                            type="radio" name="presencia-cuello" value="SI" />
                                    </td>
                                    <td class="text-center">
                                        <input :disabled="desactivarBotones" v-model="condiciones_estructurales.cuello"
                                            type="radio" name="presencia-cuello" value="NO" />
                                    </td>
                                    <td class="text-center">
                                        <input
                                            :disabled="desactivarBotones || condiciones_estructurales.cuello === 'NO'"
                                            v-model="condiciones_estructurales.integridad_cuello" type="radio"
                                            name="integridad-cuello" value="SI" />
                                    </td>
                                    <td class="text-center">
                                        <input
                                            :disabled="desactivarBotones || condiciones_estructurales.cuello === 'NO'"
                                            v-model="condiciones_estructurales.integridad_cuello" type="radio"
                                            name="integridad-cuello" value="NO" />
                                    </td>
                                </tr>
                                <!-- HOMBROS -->
                                <tr>
                                    <td class="text-center">
                                        <div class="componente-item">HOMBROS</div>
                                    </td>
                                    <td class="text-center">
                                        <input :disabled="desactivarBotones" v-model="condiciones_estructurales.hombros"
                                            type="radio" name="presencia-hombros" value="SI" />
                                    </td>
                                    <td class="text-center">
                                        <input :disabled="desactivarBotones" v-model="condiciones_estructurales.hombros"
                                            type="radio" name="presencia-hombros" value="NO" />
                                    </td>
                                    <td class="text-center">
                                        <input
                                            :disabled="desactivarBotones || condiciones_estructurales.hombros === 'NO'"
                                            v-model="condiciones_estructurales.integridad_hombros" type="radio"
                                            name="integridad-hombros" value="SI" />
                                    </td>
                                    <td class="text-center">
                                        <input
                                            :disabled="desactivarBotones || condiciones_estructurales.hombros === 'NO'"
                                            v-model="condiciones_estructurales.integridad_hombros" type="radio"
                                            name="integridad-hombros" value="NO" />
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>

                </v-card>
            </v-col>
        </v-row>
        <v-col cols="12" sm="12" md="9"  class="text-center">
            <v-spacer></v-spacer>
            <v-simple-table dense>
                <template v-slot:default>
                    <tbody>
                        <tr>
                            <td class="text-center">Número de respuestas negativas</td>
                            <td class="text-center">
                                {{ $respuestasNegativas = conteoNo }}
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-col>
        <br>
        <v-col xs="12" sm="12" md="12">
            <v-textarea v-model="condiciones_estructurales.observacionesItems" dense outlined auto-grow label="Observaciones o comentarios: ">
            </v-textarea>
        </v-col>
    </div>
</template>
<script>
    export default {
        name: "ItemsValoracionVale",
        props: ["datos"],
        data() {
            return {
                desactivarBotones:null,
                condiciones_estructurales: {
                    consulta_id: this.datos.id,
                    orejas: null,
                    integridad_orejas: null,
                    labios: null,
                    integridad_labios: null,
                    lengua: null,
                    integridad_lengua: null,
                    nariz: null,
                    integridad_nariz: null,
                    paladar: null,
                    integridad_paladar: null,
                    ojos: null,
                    integridad_ojos: null,
                    dientes: null,
                    integridad_dientes: null,
                    cuello: null,
                    integridad_cuello: null,
                    hombros: null,
                    integridad_hombros: null,
                    observacionesItems: null,
                },
                consulta_id: this.datos.id,
            }
        },
        computed: {
            conteoNo() {
                return Object.values(this.condiciones_estructurales).filter(valor => valor === 'NO').length;
            }
        },
        watch: {
            conteoNo(newVal) {
                this.$emit('conteoNo', newVal);
            },
            condiciones_estructurales: {
                handler(nuevoValor) {
                    this.$emit('recibirCondicionesEstructurales', nuevoValor);
                },
                deep: true,
                immediate: false
            },
        },
        mounted() {
            const organos = ['orejas', 'labios', 'lengua', 'nariz', 'paladar', 'ojos', 'dientes', 'cuello',
            'hombros', ];

            organos.forEach((organo) => {
                this.$watch(`condiciones_estructurales.${organo}`, (nuevoValor) => {
                    if (nuevoValor === 'NO') {
                        this.condiciones_estructurales[`integridad_${organo}`] = null;
                    }
                });
            });
        },
    };

</script>