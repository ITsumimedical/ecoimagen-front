<template>
    <div>
        <v-container><v-alert text dense color="info" border="left" icon="mdi-human-pregnant"
                class="text-center"><b>ANTECEDENTES
                    PARTO</b></v-alert>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field label="Edad gestacional" dense outlined v-model="formParto.edad_gestacional"
                            type="number" :rules="campoRequerido"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-select label="Tipo de parto" dense outlined v-model="formParto.tipo_parto" type="number"
                            :items="TiposParto" :rules="campoRequerido"></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-textarea label="Presentacion cefálica" dense outlined
                            v-model="formParto.presentacion_cefalica"
                            hint="Escribe una descripción sobre posición en la que el bebé se encuentra en el útero antes del parto"
                            :rules="campoRequerido"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-select label="¿Inducido con pitocin?" dense outlined v-model="formParto.inducido_pitocin"
                            :items="opcionSino" :rules="campoRequerido"></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-textarea label="Fórceps" dense outlined v-model="formParto.forceps"
                            :rules="campoRequerido"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-select label="¿Cesárea?" dense outlined v-model="formParto.cesarea" :items="opcionSino"
                            :rules="campoRequerido"></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" v-if="formParto.cesarea">
                        <v-textarea label="Razón de la cesárea" dense outlined v-model="formParto.descipricion_cesarea"
                            :rules="campoRequerido"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                        <v-text-field label="Peso al nacer" dense outlined v-model="formParto.peso"
                            :rules="campoRequerido"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                        <v-text-field label="Talla al nacer" dense outlined v-model="formParto.talla"
                            :rules="campoRequerido"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                        <v-select label="Anoxia" dense outlined v-model="formParto.anoxia" :items="opcionSino"
                            :rules="campoRequerido"></v-select>
                    </v-col>
                    <v-col>
                        <v-select label="Reanimación" dense outlined v-model="formParto.reanimacion" :items="opcionSino"
                            :rules="campoRequerido"></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-select label="Incubadora" dense outlined v-model="formParto.incubadora" :items="opcionSino"
                            :rules="campoRequerido"></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" v-if="formParto.incubadora">
                        <v-textarea label="Descripción incubadora" dense outlined
                            v-model="formParto.descripcion_incubadora" :rules="campoRequerido"></v-textarea>
                    </v-col>
                    <v-col cols="12" md="4" sm="4" v-if="formParto.incubadora">
                        <v-select label="Tiempo en incubadora" :items="tiempoIncubadora" dense outlined
                            v-model="formParto.tiempo_incubadora" :rules="campoRequerido"></v-select>
                    </v-col>
                    <v-col cols="12" md="4" sm="4">
                        <v-select label="Succión" :items="opcionSino" dense outlined v-model="formParto.succion"
                            :rules="campoRequerido"></v-select>
                    </v-col>
                    <v-col cols="12" md="4" sm="4">
                        <v-select label="Malformaciones" :items="opcionSino" dense outlined
                            v-model="formParto.malformaciones" :rules="campoRequerido"></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" v-if="formParto.malformaciones">
                        <v-textarea label="Descripción malformaciones" dense outlined
                            v-model="formParto.descripcion_malformaciones" :rules="campoRequerido"></v-textarea>
                    </v-col>
                    <v-col cols="12" md="4" sm="4">
                        <v-select label="Hipoglucemia" :items="opcionSino" dense outlined
                            v-model="formParto.hipoglucemia" :rules="campoRequerido"></v-select>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                        <v-select label="Desnutrición" :items="opcionSino" dense outlined
                            v-model="formParto.desnutricion" :rules="campoRequerido"></v-select>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                        <v-select label="Ictericia" :items="opcionSino" dense outlined v-model="formParto.ictericia"
                            :rules="campoRequerido"></v-select>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                        <v-select label="Alta Hospitalaria" :items="opcionSino" dense outlined
                            v-model="formParto.alta_hospitalaria" :rules="campoRequerido"></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-select label="Convulsiones" :items="opcionSino" dense outlined
                            v-model="formParto.convulsiones" :rules="campoRequerido"></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" v-if="formParto.convulsiones">
                        <v-textarea label="Descripción convulsiones" dense outlined
                            v-model="formParto.descripcion_convulsiones" :rules="campoRequerido"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-btn block dark color="success" @click="guardar()" :loading="loading">
                            Agregar
                            <v-icon right>mdi-plus-circle-outline</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
            <v-col>
                <v-alert text dense color="warning" border="left" icon="mdi-history" class="text-center"><b>HISTÓRICO DE
                        ANTECEDENTES</b></v-alert>
            </v-col>
            <v-row justify="center">
                <v-col>
                    <v-expansion-panels inset>
                        <v-expansion-panel v-for="(item, i) in historico" :key="i">
                            <v-expansion-panel-header>
                                <div><b>Antecedentes del parto</b></div>
                                <div>
                                    <b>Registrado por:</b>
                                    {{ `${item.creado_por.operador?.nombre || ''} ${item.creado_por.operador?.apellido
                                    || ''}`.trim() || 'Sin nombre' }}
                                </div>
                            </v-expansion-panel-header>

                            <v-expansion-panel-content>
                                <p>Edad gestacional: {{ item.edad_gestacional }}</p>
                                <p>Tipo de parto: {{ item.tipo_parto }}</p>
                                <p>Presentación cefálica: {{ item.presentacion_cefalica }}</p>
                                <p>Inducido con pitocín: {{ item.inducido_pitocin ? 'Sí' : 'No' }}</p>
                                <p>Fórceps: {{ item.forceps }}</p>
                                <p>Cesárea: {{ item.cesarea ? 'Sí' : 'No' }}</p>
                                <p>Descripción de la cesárea: {{ item.descipricion_cesarea }}</p>
                                <p>Peso: {{ item.peso }}</p>
                                <p>Talla: {{ item.talla }}</p>
                                <p>Anoxia: {{ item.anoxia ? 'Sí' : 'No' }}</p>
                                <p>Reanimación: {{ item.reanimacion ? 'Sí' : 'No' }}</p>
                                <p>Incubadora: {{ item.incubadora ? 'Sí' : 'No' }}</p>
                                <p>Descripción de la incubadora: {{ item.descripcion_incubadora }}</p>
                                <p>Tiempo en incubadora: {{ item.tiempo_incubadora }}</p>
                                <p>Succión: {{ item.succion ? 'Sí' : 'No' }}</p>
                                <p>Malformaciones: {{ item.malformaciones ? 'Sí' : 'No' }}</p>
                                <p>Descripción de las malformaciones: {{ item.descripcion_malformaciones }}</p>
                                <p>Hipoglucemia: {{ item.hipoglucemia ? 'Sí' : 'No' }}</p>
                                <p>Desnutrición: {{ item.desnutricion ? 'Sí' : 'No' }}</p>
                                <p>Ictericia: {{ item.ictericia ? 'Sí' : 'No' }}</p>
                                <p>Descripción de la ictericia: {{ item.descripcion_ictericia }}</p>
                                <p>Convulsiones: {{ item.convulsiones ? 'Sí' : 'No' }}</p>
                                <p>Descripción de las convulsiones: {{ item.descripcion_convulsiones }}</p>
                                <p>Alta hospitalaria: {{ item.alta_hospitalaria ? 'Sí' : 'No' }}</p>
                            </v-expansion-panel-content>

                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
            </v-row>
        </v-container>
    </div>

</template>

<script>
export default {
    props: ['datos'],

    data() {
        return {
            formParto: {
                edad_gestacional: '',
                tipo_parto: '',
                presentacion_cefalica: '',
                inducido_pitocin: '',
                forceps: '',
                cesarea: '',
                descipricion_cesarea: '',
                peso: '',
                talla: '',
                anoxia: '',
                reanimacion: '',
                incubadora: '',
                descripcion_incubadora: '',
                tiempo_incubadora: '',
                succion: '',
                malformaciones: '',
                descripcion_malformaciones: '',
                hipoglucemia: '',
                desnutricion: '',
                ictericia: '',
                descripcion_ictericia: '',
                convulsiones: '',
                descripcion_convulsiones: '',
                alta_hospitalaria: '',
                consulta_id: this.datos.id,
            },
            TiposParto: [
                'Parto vaginal',
                'Parto eutócico',
                'Parto distócico',
                'Cesárea',
                'Parto inducido',
                'Parto instrumental',
                'Parto asistido',
                'Parto en agua',
                'Parto domiciliario',
                'Parto natural',
                'Parto humanizado',
                'Parto cefálico',
                'Parto de nalgas',
                'Parto transverso'
            ],
            opcionSino: [
                {
                    text: 'Si',
                    value: true
                },
                {
                    text: 'No',
                    value: false
                }
            ],
            tiempoIncubadora: [
                'De 1 a 2 días',
                '1 semana',
                'Más de 28 semanas',
                'de 34 a 36 semanas'
            ],
            valid: true,
            loading: false,
            historico: [],
            campoRequerido: [
                v => v !== null && v !== undefined && v !== '' || 'Este campo es requerido',
            ],

        }
    },

    mounted() {
        this.listarHistorico()
    },

    methods: {
        guardar() {
            if (!this.$refs.form.validate()) {
                return this.$toast.error('Campos requeridos sin digilenciar')
            }
            this.loading = true;
            this.$axios.post('antecedenteParto/crear', this.formParto).then(() => {
                this.$toast.success('Guardado con éxito');
                this.limpiarData();
                this.listarHistorico();
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                this.loading = false;
            })
        },

        limpiarData() {
            this.formParto = {},
                this.$refs.form.resetValidation();
        },

        listarHistorico() {
            this.$axios.get(`antecedenteParto/obtenerDatos/${this.datos.afiliado.id}`).then(res => {
                this.historico = res.data
            }).catch(error => {
                console.log(error);
                this.$toast.error('Error al cargar los datos');
            });
        },
    }
}
</script>
