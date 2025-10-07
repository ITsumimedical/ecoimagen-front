<template>
    <div>
        <v-form ref="antecedentesGestacion">
            <v-row dense>
                <v-col cols="12" sm="12" md="12">
                    <v-alert class="text-center" dense text type="info" icon="mdi-human-pregnant" border="left">
                        <b>ANTECEDENTES DE GESTACIÓN</b>
                    </v-alert>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-text-field dense outlined label="Gestación N *°" v-model="formGestacion.gestacion_numero"
                        type="number" :rules="[rules.obligatorio, rules.noNegativo]"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-text-field dense outlined label="N° Controles *" v-model="formGestacion.controles" type="number"
                        :rules="[rules.obligatorio, rules.noNegativo]"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-select dense outlined label="Amenazas de Aborto *" v-model="formGestacion.amenazas_aborto"
                        :items="opcionesAmenazaAborto" :rules="[rules.obligatorio]">
                    </v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-select dense outlined label="Infecciones durante el Embarazo *"
                        v-model="formGestacion.infecciones_embarazo" :items="opcionesAmenazaAborto"
                        :rules="[rules.obligatorio]">
                    </v-select>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-select dense outlined label="¿Ha tenido Enfermedades y Tratamientos? *"
                        v-model="formGestacion.enfermedades_tratamiento" :items="opcionesSiNo"
                        :rules="[rules.obligatorio]"
                        @change="formGestacion.descripcion_enfermedades_tratamiento = ''"></v-select>
                </v-col>
                <v-col cols="12" sm="12" md="12" v-if="formGestacion.enfermedades_tratamiento === 'Si'">
                    <v-textarea dense outlined auto-grow label="Descripción del Tratamiento"
                        v-model="formGestacion.descripcion_enfermedades_tratamiento"
                        :rules="[rules.obligatorio, rules.minCaracteres]"></v-textarea>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-select label="¿Ha tenido problemas relacionados con el alcoholismo? *"
                        v-model="formGestacion.alcoholismo" dense outlined :items="opcionesSiNo"
                        :rules="[rules.obligatorio]"></v-select>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-select label="¿Ha tenido problemas relacionados con la drogadicción? *" dense outlined
                        v-model="formGestacion.drogadiccion" :items="opcionesSiNo"
                        :rules="[rules.obligatorio]"></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                    <v-text-field label="Edad de la madre" dense outlined type="number"
                        :rules="[rules.obligatorio, rules.noNegativo]"
                        v-model="formGestacion.edad_madre"></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                    <v-text-field label="Edad del padre" dense outlined type="number"
                        :rules="[rules.obligatorio, rules.noNegativo]"
                        v-model="formGestacion.edad_padre"></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                    <v-select label="Grado de consanguinidad" dense outlined :items="gradosConsanguinidad"
                        :rules="[rules.obligatorio]" v-model="formGestacion.consanguinidad"></v-select>
                </v-col>
            </v-row>
            <v-col cols="12" sm="12" md="12">
                <v-btn block dark color="success" @click="crear()">
                    Agregar
                    <v-icon right>mdi-plus-circle-outline</v-icon>
                </v-btn>
            </v-col>
        </v-form>
        <v-col cols="12" sm="12" md="12">
            <v-alert class="text-center" dense text color="blue-grey" border="left" icon="mdi-history"><b>HISTÓRICO DE
                    ANTECEDENTES</b></v-alert>
        </v-col>
        <v-data-table :headers="headers" :items="historicoAntecedentes" :loading="loading">
            <template v-slot:[`item.user.operador`]="{ item }">
              {{ `${item.user.operador?.nombre || ''} ${item.user.operador?.apellido || ''}`.trim() || 'Sin nombre' }}
            </template>
            <template v-slot:[`item.alcoholismo`]="{ item }">
                {{ item.alcoholismo ? 'Si' : 'No' }}
            </template>
            <template v-slot:[`item.drogadiccion`]="{ item }">
                {{ item.drogadiccion ? 'Si' : 'No' }}
            </template>
            <template v-slot:[`item.enfermedades_tratamiento`]="{ item }">
                {{ item.enfermedades_tratamiento ? 'Si' : 'No' }}
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }"
                        v-if="item.creado_por.id === $store.state.auth.usuario.id">
                        <v-icon color="red" class="mr-2" v-bind="attrs" v-on="on" @click="eliminar(item.id)">
                            mdi-delete-circle-outline
                        </v-icon>
                    </template>
                    <span>Eliminar</span>
                </v-tooltip>
            </template>
        </v-data-table>
    </div>
</template>
<script>
export default {
    props: ['datos'],
    data() {
        return {
            formGestacion: {
                gestacion_numero: null,
                controles: null,
                amenazas_aborto: null,
                infecciones_embarazo: null,
                enfermedades_tratamiento: null,
                descripcion_enfermedades_tratamiento: "",
                alcoholismo: null,
                drogadiccion: null,
                edad_madre: null,
                edad_padre: null,
                consanguinidad: null,
                consulta_id: this.datos.id
            },
            opcionesAmenazaAborto: [
                'Ninguna',
                '1 a 3',
                '2 a 5',
                'Más de 5',
            ],
            opcionesSiNo: [{
                text: 'Si',
                value: true
            },
            {
                text: 'No',
                value: false
            }
            ],
            gradosConsanguinidad: [
                'Primer grado (Padres e hijos)',
                'Segundo grado (Hermanos, abuelos, nietos)',
                'Tercer grado (Bisabuelos, bisnietos, tíos y sobrinos)',
                'Cuarto grado (Primos, sobrinos, nietos, tíos abuelos)'
            ],
            rules: {
                obligatorio: v => v !== null && v !== undefined && v !== '' || "Este campo es obligatorio.",
                minCaracteres: v => v.length >= 5 || 'Este campo debe tener al menos 5 caractéres.',
                noNegativo: v => v >= 0 || 'Este campo no debe ser negativo',
            },
            historicoAntecedentes: [],
            headers: [
                {
                    text: 'Gestación',
                    value: 'gestacion_numero'
                },
                {
                    text: 'N° Controles',
                    value: 'controles'
                },
                {
                    text: 'Amenazas aborto',
                    value: 'amenazas_aborto'
                },
                {
                    text: 'Infecciones embarazo',
                    value: 'infecciones_embarazo'
                },
                {
                    text: 'Enfermedades/Tratamientos',
                    value: 'enfermedades_tratamiento'
                },
                {
                    text: 'Alcoholismo',
                    value: 'alcoholismo'
                },
                {
                    text: 'Drogadicción',
                    value: 'drogadiccion'
                },
                {
                    text: 'Edad madre',
                    value: 'edad_madre'
                },
                {
                    text: 'Edad padre',
                    value: 'edad_padre'
                },
                {
                    text: 'Consanguinidad',
                    value: 'consanguinidad'
                },
                {
                    text: 'Registrado por',
                    value: 'creado_por.operador'
                },
                {
                    text: 'Acciones',
                    value:'actions'
                }
            ],
            loading: false,
        }

    },
    mounted() {
        this.cargarDatos()
    },
    methods: {

        crear() {
            this.$axios.post('antecedentesGestacion/crear', this.formGestacion).then(() => {
                this.$toast.success('Se ha guardado con éxito');
                this.limpiarData()
                this.cargarDatos()
            }).catch((error) => {
                console.log(error)
            })
        },

        cargarDatos() {
            this.loading = true;
            this.$axios.get(`antecedentesGestacion/obtenerDatos/${this.datos.afiliado.id}`).then(res => {
                this.historicoAntecedentes = res.data;
            }).catch(error => {
                console.log(error);
                this.$toast.error('Error al cargar los datos');
            }).finally(() => {
                this.loading = false;
            })
        },

        eliminar(id) {
            return this.$swal({
                title: '¿Estás seguro de eliminar?',
                text: "No podrás revertir esto",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.value) {
                    this.$axios.delete(`/antecedentesGestacion/eliminar/${id}`)
                        .then((res) => {
                            this.$toast.success(res.data.mensaje);
                            this.cargarDatos();
                        })
                        .catch((err) => {
                            console.error(err);
                            this.$toast.error('Error al eliminar el resultado de laboratorio');
                        });
                }
            });
        },

        limpiarData() {
            this.formGestacion = {
                gestacion_numero: null,
                controles: null,
                amenazas_aborto: null,
                infecciones_embarazo: null,
                enfermedades_tratamiento: null,
                descripcion_enfermedades_tratamiento: "",
                alcoholismo: null,
                drogadiccion: null,
                edad_madre: null,
                edad_padre: null,
                consanguinidad: null,
                consulta_id: this.datos.id
            }
        }
    }
}
</script>
