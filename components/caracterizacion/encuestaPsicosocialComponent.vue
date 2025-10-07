<template>
	<v-container>
		<v-card outlined elevation="2" class="pa-10">
			<v-card-title class="headline">3. CARACTERIZACIÓN DE LOS INTEGRANTES DE LA FAMILIA </v-card-title>
			<v-divider></v-divider>
			<v-form ref="form" @submit.prevent="guardarDatos">
                <v-container outlined >
                        <br>
                    <v-row>
                        <v-subheader><i>La siguiente información debe ser diligenciada por cada uno de
                                los integrantes de la familia, que residen en la vivienda y corresponde a las
                                personas que comen y duermen habitualmente en este hogar,
                                presentes o no <strong>Incluyendo el afiliado</strong> </i></v-subheader>
                        <br />
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="d-flex justify-start">
                            <v-btn @click="mostrarFormulario = true" color="primary" small>Agregar Miembro<v-icon right>
                                    mdi-plus </v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-row>
                            <v-dialog v-model="mostrarFormulario" max-width="1200px" scrollable>
                                <v-card >
                                    <v-card-title>
                                        <br />{{ editando ? "EDITAR MIEMBRO" : "AGREGAR MIEMBRO" }}
                                        <br />
                                    </v-card-title>
                                    <v-divider></v-divider>

                                    <v-card-text>
                                        <v-form ref="formFamilia">
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-alert text dense border="left" type="info" :icon="false" class="text-center">
                                                        <b>3.1. Identificación de cada uno de los integrantes.</b>
                                                    </v-alert>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" md="3">
                                                    <v-text-field :rules="[rules.obligatorio]" v-model="formFamilia.id"
                                                        dense outlined label="ID" disabled />
                                                </v-col>
                                                <v-col cols="12" md="3">
                                                    <v-text-field :rules="[rules.obligatorio]" v-model="formFamilia.primer_nombre"
                                                        dense outlined label="49. Primer nombre" :disabled="edit == true" allow-overflow />
                                                </v-col>
                                                <v-col cols="12" md="3">
                                                    <v-text-field v-model="formFamilia.segundoNombre"
                                                        dense outlined label="50. Segundo nombre" :disabled="edit == true" allow-overflow />
                                                </v-col>
                                                <v-col cols="12" md="3">
                                                    <v-text-field :rules="[rules.obligatorio]" v-model="formFamilia.primerApellido"
                                                        dense outlined label="51. Primer apellido" :disabled="edit == true"/>
                                                </v-col>
                                                <v-col cols="12" md="3">
                                                    <v-text-field v-model="formFamilia.segundoApellido"
                                                        dense outlined label="52. Segundo apellido" :disabled="edit == true"/>
                                                </v-col>
                                                <v-col cols="12" md="3">
                                                    <v-autocomplete dense outlined label="53. Tipo de Documento"
                                                        :disabled="edit == true"
                                                        :items="tiposDocumentos"
                                                        v-model="formFamilia.tipo_documento"
                                                        :rules="[rules.obligatorio]" />
                                                </v-col>
                                                <v-col cols="12" md="3">
                                                    <v-text-field dense outlined label="54. Número Documento"
                                                        :disabled="edit == true"
                                                        v-model="formFamilia.numero_documento"
                                                        :rules="[rules.obligatorio]" />
                                                </v-col>
                                                <v-col cols="12" md="3">
                                                    <v-text-field :rules="[rules.obligatorio, rules.fechaNacimiento]"
                                                        v-model="formFamilia.fecha_nacimiento" dense outlined type="date"
                                                        label="55. Fecha de nacimiento" :disabled="edit == true"/>
                                                </v-col>
                                                <v-col cols="12" md="3">
                                                    <v-autocomplete :rules="[rules.obligatorio]" v-model="formFamilia.sexo"
                                                        dense outlined label="56. Sexo" :items="sexos" :disabled="edit == true">
                                                    </v-autocomplete>
                                                </v-col>
                                                <v-col cols="12" md="3">
                                                    <v-autocomplete :rules="[rules.obligatorio]"
                                                        v-model="formFamilia.rol" dense outlined
                                                        label="57. Rol dentro de la familia" :items="parentescos" allow-overflow>
                                                    </v-autocomplete>
                                                    <v-text-field dense outlined label="¿Cuál?" v-model="formFamilia.otroRol"
                                                        v-show="formFamilia.rol === 'Otro'"
                                                        :rules="[rules.visibleObligatorioOtro(formFamilia.otroRol, formFamilia.rol)]" />
                                                </v-col>
                                                <v-col cols="12" md="3">
                                                    <v-autocomplete :rules="[rules.obligatorio]"
                                                        v-model="formFamilia.ocupacion" dense outlined label="58. Ocupación"
                                                        :items="ocupaciones" allow-overflow>
                                                    </v-autocomplete>
                                                </v-col>
                                                <v-col cols="12" md="3">
                                                    <v-autocomplete dense outlined label="59. Nivel de Escolaridad"
                                                        :items="escolaridad" :rules="[rules.obligatorio]"
                                                        v-model="formFamilia.nivelEscolaridad" allow-overflow>
                                                    </v-autocomplete>
                                                </v-col>
                                                <v-col cols="12" md="3">
                                                    <v-autocomplete :rules="[rules.obligatorio]"
                                                        v-model="formFamilia.afiliacion" dense outlined
                                                        label="60. Régimen de afiliación" allow-overflow :items="afiliaciones">
                                                    </v-autocomplete>
                                                </v-col>
                                                <v-col cols="12" md="3">
                                                    <v-text-field :rules="[rules.obligatorio]" v-model="formFamilia.eapb"
                                                        dense outlined label="61. EAPB" />
                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <v-autocomplete dense outlined
                                                        label="62. Pertenencia a un grupo poblacional de especial protección"
                                                        :items="pertenenciaItems" :rules="[rules.obligatorio]"
                                                        v-model="formFamilia.pertenencia"></v-autocomplete>
                                                </v-col>
                                                <v-col cols="12" md="4">
                                                    <v-autocomplete dense outlined
                                                        label="63. Pertenencia étnica."
                                                        :items="etniaItems" :rules="[rules.obligatorio]"
                                                        v-model="formFamilia.etnia"></v-autocomplete>
                                                </v-col>
                                                <v-col cols="12" md="4">
                                                    <v-text-field v-model="formFamilia.pueblo"
                                                        dense outlined label="64. Comunidad o pueblo indigena" />
                                                </v-col>
                                                <v-col cols="12" md="4">
                                                    <v-autocomplete dense outlined label="65. Reconoce alguna discapacidad"
                                                        :items="discapacidad" :rules="[rules.obligatorio]"
                                                        v-model="formFamilia.discapacidad" allow-overflow>
                                                    </v-autocomplete>
                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <v-autocomplete dense outlined label="66. El integrante de la familia presenta situaciones o condiciones de salud crónica."
                                                        :items="siNoItems" :rules="[rules.obligatorio]"
                                                        v-model="formFamilia.saludCronica" allow-overflow>
                                                    </v-autocomplete>
                                                </v-col>
                                            </v-row>
                                            <v-col cols="12">
                                                <v-divider class="my-4"></v-divider>
                                            </v-col>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-alert text dense border="left" type="info" :icon="false" class="text-center">
                                                        <b>3.2. Situaciones o condiciones de salud</b>
                                                    </v-alert>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" >
                                                    <v-card outlined>
                                                        <v-card-text>
                                                            <v-row class="d-flex flex-wrap">
                                                                <v-card-subtitle>
                                                                    <v-label>67. Cumple con el esquema de atenciones de promoción y mantenimiento</v-label>
                                                                </v-card-subtitle>
                                                                <v-col cols="auto">
                                                                    <v-radio-group v-model="formFamilia.cumpleEsquema" :rules="[rules.obligatorio]">
                                                                        <v-row>
                                                                            <v-radio class="ml-15" label="Sí" value="Si"></v-radio>
                                                                            <v-radio class="ml-5" label="No" value="No"></v-radio>
                                                                        </v-row>
                                                                    </v-radio-group>
                                                                </v-col>
                                                            </v-row>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                                <v-col cols="12" >
                                                    <v-card outlined>
                                                        <v-card-title class="subtitle-1">
                                                            <strong>
                                                                68. Intervenciones pendientes de promoción y mantenimiento (puede seleccionar más de una opción).
                                                            </strong>
                                                        </v-card-title>
                                                        <v-card-text>
                                                            <v-row class="d-flex flex-wrap">
                                                                <v-col cols="auto">
                                                                    <v-row>
                                                                        <v-checkbox
                                                                            class="ml-10"
                                                                            :label="item"
                                                                            multiple
                                                                            v-model="formFamilia.intervenciones"
                                                                            v-for="(item, index) in intervencionesItems"
                                                                            :value="item" :key="index"
                                                                            :rules="[rules.obligatorio]">
                                                                        </v-checkbox>
                                                                    </v-row>
                                                                </v-col>
                                                            </v-row>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                                <v-col cols="12" >
                                                    <v-card outlined>
                                                        <v-card-title class="subtitle-1">
                                                            <strong>
                                                                69. Motivo por el cual no ha recibido las atenciones de promoción y mantenimiento de la salud. (puede seleccionar más de una opción)
                                                            </strong>
                                                        </v-card-title>
                                                        <v-card-text>
                                                            <v-row class="d-flex flex-wrap">
                                                                <v-col cols="auto">
                                                                    <v-row>
                                                                        <v-checkbox
                                                                            class="ml-10"
                                                                            :label="item"
                                                                            multiple
                                                                            v-model="formFamilia.motivos"
                                                                            v-for="(item, index) in motivosItems"
                                                                            :value="item" :key="index"
                                                                            :rules="[rules.obligatorio]">
                                                                        </v-checkbox>
                                                                    </v-row>
                                                                </v-col>
                                                            </v-row>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                                <v-col cols="12" md="4" >
                                                    <v-card outlined>
                                                        <v-card-subtitle>
                                                            <v-label>70. ¿Realiza alguna práctica deportiva o ejercicio?</v-label>
                                                        </v-card-subtitle>
                                                        <v-card-text>
                                                            <v-row class="d-flex flex-wrap">
                                                                <v-col cols="auto">
                                                                    <v-radio-group v-model="formFamilia.ejercicio"
                                                                        :rules="[rules.obligatorio]">
                                                                        <v-row>
                                                                            <v-radio class="ml-5" label="Sí" value="Si"></v-radio>
                                                                            <v-radio class="ml-5" label="No" value="No"></v-radio>
                                                                        </v-row>
                                                                    </v-radio-group>
                                                                </v-col>
                                                            </v-row>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                                <v-col cols="12" md="4" >
                                                    <v-card outlined>
                                                        <v-card-subtitle>
                                                            <v-label>71. Si es menor de 6 meses, ¿recibe lactancia materna exclusiva?</v-label>
                                                        </v-card-subtitle>
                                                        <v-card-text>
                                                            <v-row class="d-flex flex-wrap">
                                                                <v-col cols="auto">
                                                                    <v-radio-group v-model="formFamilia.lactancia">
                                                                        <v-row>
                                                                            <v-radio class="ml-5" label="Sí" value="Si"></v-radio>
                                                                            <v-radio class="ml-5" label="No" value="No"></v-radio>
                                                                        </v-row>
                                                                    </v-radio-group>
                                                                </v-col>
                                                            </v-row>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                                <v-col cols="12" md="4" >
                                                    <v-card outlined>
                                                        <v-card-subtitle>
                                                            <v-label>73. ¿Es menor de 5 años?</v-label>
                                                        </v-card-subtitle>
                                                        <v-card-text>
                                                            <br>
                                                            <v-row class="d-flex flex-wrap">
                                                                <v-col cols="auto">
                                                                    <v-radio-group v-model="formFamilia.ninosMenoresCinco" :rules="[rules.obligatorio]">
                                                                        <v-row>
                                                                            <v-radio class="ml-5" label="Sí" value="Si"></v-radio>
                                                                            <v-radio class="ml-5" label="No" value="No"></v-radio>
                                                                        </v-row>
                                                                    </v-radio-group>
                                                                </v-col>
                                                            </v-row>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                                <v-col cols="12" md="4">
                                                    <v-card-subtitle>
                                                        <v-label>72. Si es menor de 2 años ¿Hasta cuándo recibió lactancia materna? (en meses)</v-label>
                                                    </v-card-subtitle>
                                                    <v-card-text>
                                                        <v-col cols="auto">
                                                            <v-text-field v-model="formFamilia.mesesLactancia" type="number"
                                                                dense outlined label="escriba aca el número de meses." />
                                                        </v-col>
                                                    </v-card-text>
                                                </v-col>
                                                <v-col cols="12" md="8">
                                                    <v-card outlined>
                                                        <v-card-subtitle>
                                                            <v-label>74. Resultado de toma de medidas antropométricas</v-label>
                                                        </v-card-subtitle>
                                                        <v-card-text>
                                                            <br>
                                                            <v-row>
                                                                <v-col cols="6">
                                                                    <v-text-field v-model="formFamilia.peso" type="number"
                                                                        dense outlined label="74.1 Peso (en Kilogramos)" :rules="[rules.obligatorio]"/>
                                                                </v-col>
                                                                <v-col cols="6">
                                                                    <v-text-field v-model="formFamilia.talla" type="number"
                                                                        dense outlined label="74.2 Talla (en centímetros)" :rules="[rules.obligatorio]"/>
                                                                </v-col>
                                                            </v-row>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <v-card-subtitle>
                                                        <v-label>75. Diagnóstico nutricional indicador Peso para la talla</v-label>
                                                    </v-card-subtitle>
                                                    <v-card-text>
                                                        <br>
                                                        <v-autocomplete dense outlined label="Seleccione una opción"
                                                            :items="imcItems" :rules="[rules.obligatorio]"
                                                            v-model="formFamilia.diagnosticoImc" allow-overflow>
                                                        </v-autocomplete>
                                                    </v-card-text>
                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <v-card-subtitle>
                                                        <v-label>76. Medida complementaria identificación de riesgo de muerte por desnutrición aguda, perimetro braquial</v-label>
                                                    </v-card-subtitle>
                                                    <v-card-text>
                                                        <v-text-field v-model="formFamilia.PerimetroBraquial" type="number"
                                                            dense outlined label="escriba solo la medida en cm." :rules="[rules.obligatorio]" />
                                                    </v-card-text>
                                                </v-col>
                                                <v-col cols="12" >
                                                    <v-card outlined>
                                                        <v-card-title class="subtitle-1">
                                                            <strong>
                                                                77. Se identifican signos físicos de desnutrición aguda.
                                                            </strong>
                                                        </v-card-title>
                                                        <v-card-text>
                                                            <v-row class="d-flex flex-wrap">
                                                                <v-col cols="auto">
                                                                    <v-row>
                                                                        <v-checkbox
                                                                            class="ml-10"
                                                                            :label="item"
                                                                            multiple
                                                                            v-model="formFamilia.areasDesnutricion"
                                                                            v-for="(item, index) in areasCuerpoItems"
                                                                            :value="item" :key="index">
                                                                        </v-checkbox>
                                                                    </v-row>
                                                                </v-col>
                                                            </v-row>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                                <v-col cols="12" >
                                                    <v-card outlined>
                                                        <v-card-subtitle>
                                                            <v-label>
                                                                78. ¿Actualmente presenta o ha presentado en el último mes alguna enfermedad como:
                                                                ¿Diarrea o soltura de estómago Tos, resfriado, gripa, bronquitis o pulmonía?
                                                                Problemas de piel / alergias, accidente casero, familiar o escolar. Alguna otra
                                                                enfermedad.
                                                            </v-label>
                                                        </v-card-subtitle>
                                                        <v-card-text>
                                                            <v-row class="d-flex flex-wrap">
                                                                <v-col cols="auto">
                                                                    <v-radio-group v-model="formFamilia.enfermedades"
                                                                        :rules="[rules.obligatorio]">
                                                                        <v-row>
                                                                            <v-radio class="ml-5" label="Sí" value="Si"></v-radio>
                                                                            <v-radio class="ml-5" label="No" value="No"></v-radio>
                                                                        </v-row>
                                                                    </v-radio-group>
                                                                </v-col>
                                                            </v-row>
                                                            <v-textarea
                                                                v-model="formFamilia.enfermedadesCuales"
                                                                label="78.2. ¿Cuáles?" outlined dense
                                                                v-if="formFamilia.enfermedades === 'Si'" :rules="[rules.obligatorio]">
                                                            </v-textarea>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                                <v-col cols="12" v-if="formFamilia.enfermedades === 'Si'">
                                                    <v-card outlined>
                                                        <v-card-subtitle>
                                                            <v-label>
                                                                79. ¿Está recibiendo atención y tratamiento para la enfermedad actual?
                                                            </v-label>
                                                        </v-card-subtitle>
                                                        <v-card-text>
                                                            <v-row class="d-flex flex-wrap">
                                                                <v-col cols="auto">
                                                                    <v-radio-group v-model="formFamilia.ttoEnfermedades"
                                                                        :rules="[rules.obligatorio]">
                                                                        <v-row>
                                                                            <v-radio class="ml-5" label="Sí" value="Si"></v-radio>
                                                                            <v-radio class="ml-5" label="No" value="No"></v-radio>
                                                                        </v-row>
                                                                    </v-radio-group>
                                                                </v-col>
                                                            </v-row>
                                                            <v-autocomplete
                                                                v-model="formFamilia.noTtoEnfermedades"
                                                                label="80. ¿Cual es el motivo por el cual no ha recibido la atención?" outlined dense
                                                                v-if="formFamilia.ttoEnfermedades === 'No'"
                                                                :items="motivosNoTtoItems" :rules="[rules.obligatorio]">
                                                            </v-autocomplete>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                                <v-col cols="12" >
                                                    <v-card outlined>
                                                        <v-card-title class="subtitle-1">
                                                            <strong>
                                                                81. Si pertenece a población étnica. ¿Actualmente es acompañado u orientado por algún agente de la medicina tradicional?.
                                                            </strong>
                                                        </v-card-title>
                                                        <v-card-text>
                                                            <v-row class="d-flex flex-wrap">
                                                                <v-col cols="auto">
                                                                    <v-row>
                                                                        <v-checkbox
                                                                            class="ml-10"
                                                                            :label="item"
                                                                            v-model="formFamilia.agenteMedicina"
                                                                            v-for="(item, index) in agenteItems"
                                                                            :value="item" :key="index"
                                                                            :rules="[rules.obligatorio]">
                                                                        </v-checkbox>
                                                                    </v-row>
                                                                </v-col>
                                                            </v-row>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>



                                            </v-row>
                                        </v-form>

                                    </v-card-text>
                                    <v-divider></v-divider>
                                    <v-card-actions>
                                        <v-col cols="12" class="d-flex justify-end">
                                            <v-btn color="error" dark dense @click="cancelarEdicion">Cancelar <v-icon right>
                                                    mdi-content-save </v-icon>
                                            </v-btn>
                                            <v-btn color="success" dark dense @click="guardarMiembro">Guardar <v-icon right>
                                                    mdi-content-save </v-icon>
                                            </v-btn>
                                        </v-col>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-row>

                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-card flat>
                                <v-data-table :headers="headers" :items="miembrosCompletos" dense class="elevation-1">
                                    <template v-slot:[`item.acciones`]="{ item }" >
                                        <v-btn
                                            :class="{'rojo': !item.agenteMedicina && rojo}"
                                            color="warning" icon @click="
                                            editarMiembro(form.miembrosFamilia.indexOf(item))">
                                                <v-icon >mdi-pencil</v-icon>
                                            </v-btn>
                                            <v-btn icon color="error" @click="
                                            eliminarMiembro(form.miembrosFamilia.indexOf(item))
                                            ">
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </template>
                                </v-data-table>
                            </v-card>
                            <br />
                        </v-col>
                    </v-row>
                </v-container>
				<v-row>
					<v-col cols="6" class="d-flex justify-start">
						<v-btn color="primary" dark dense @click="volver">Volver <v-icon right>mdi-arrow-left
							</v-icon>
						</v-btn>
					</v-col>
					<v-col cols="6" class="d-flex justify-end">
						<v-btn color="success" dark dense @click="guardar">Guardar y Continuar <v-icon right>
								mdi-content-save</v-icon>
						</v-btn>
					</v-col>
				</v-row>
			</v-form>
		</v-card>
	</v-container>
</template>

<script>
	import {
		mapActions,
		mapState,
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
				form: {
                    miembrosFamilia: [],
				},
                mostrarFormulario: false,
				editando: false,
				editIndex: null,
                edit: false,
                rojo: false,
				formFamilia: this.obtenerNuevoMiembro(),
				rules: {
					mayorQueCero: value => value > 0 || 'El valor debe ser mayor que 0',
					obligatorio: v => !!v || 'Este campo es obligatorio',
					numero: value => !isNaN(value) || 'Debe ser un número',
					fechaNacimiento: v => {
						if (!v) return 'Este campo es obligatorio';
						const partes = v.split("-");
						if (partes.length !== 3) return "Fecha inválida";

						const fechaIngresada = new Date(partes[0], partes[1] - 1, partes[2]);
						const fechaActual = new Date();
						const edadMinima = 0;
						const edadMaxima = 120;

						if (isNaN(fechaIngresada.getTime())) return "Fecha inválida";

						const diferencia = fechaActual.getFullYear() - fechaIngresada.getFullYear();
						const cumpleEsteAnio = new Date(fechaActual.getFullYear(), fechaIngresada.getMonth(),
							fechaIngresada.getDate());
						const edad = cumpleEsteAnio > fechaActual ? diferencia - 1 : diferencia;

						if (edad < edadMinima) return `Debes tener al menos ${edadMinima + 1} año.`;
						if (edad > edadMaxima) return `La edad máxima permitida es ${edadMaxima} años.`;
						return true;
					},

					visibleObligatorioOtro: (condicion, visible) => {
						if (visible == 'Otro') {
							return !!condicion || 'Este campo es obligatorio';
						}
						return true;
					},

                    nDocumento: v => {
						if (!v) return 'Este campo es obligatorio';
						const regex = /^[0-9]{6,15}$/;
						return regex.test(v) || 'El número de documento debe tener entre 6 y 15 dígitos';
					}
				},
                headers: [{
						text: "Acciones",
						value: "acciones",
						sortable: false,
					},
					{
						text: "Primer nombre",
						value: "primer_nombre",
						sortable: false
					},
					{
						text: "Segundo nombre",
						value: "segundoNombre",
						sortable: false
					},
					{
						text: "Primer apellido",
						value: "primerApellido",
						sortable: false
					},
					{
						text: "Segundo apellido",
						value: "segundoApellido",
						sortable: false
					},
					{
						text: "Tipo documento",
						value: "tipo_documento",
						sortable: false
					},
					{
						text: "Número documento",
						value: "numero_documento",
						sortable: false
					},
					{
                        text: "Fecha nacimiento",
						value: "fecha_nacimiento",
						sortable: false
					},
                    {
                        text: "Sexo",
                        value: "sexo",
                        sortable: false
                    },
                    {
                        text: "Rol",
                        value: "rol",
                        sortable: false
                    },
                    {
                        text: "Otro Rol",
                        value: "otroRol",
                        sortable: false
                    },
                    {
                        text: "Ocupación",
                        value: "ocupacion",
                        sortable: false
                    },
                    {
                        text: "Nivel Escolaridad",
                        value: "nivelEscolaridad",
                        sortable: false
                    },
                    {
                        text: "Afiliación",
                        value: "afiliacion",
                        sortable: false
                    },
                    {
                        text: "EAPB",
                        value: "eapb",
                        sortable: false
                    },
                    {
                        text: "Pertenencia",
                        value: "pertenencia",
                        sortable: false
                    },
                    {
                        text: "Etnia",
                        value: "etnia",
                        sortable: false
                    },
                    {
                        text: "Pueblo o comunidad",
                        value: "pueblo",
                        sortable: false
                    },
                    {
                        text: "Discapacidad",
                        value: "discapacidad",
                        sortable: false
                    },
                    {
                        text: "Salud crónica",
                        value: "saludCronica",
                        sortable: false
                    },
                    {
                        text: "Cumple esquema",
                        value: "cumpleEsquema",
                        sortable: false
                    },
                    {
                        text: "Intervenciones",
                        value: "intervenciones",
                        sortable: false
                    },
                    {
                        text: "Motivos",
                        value: "motivos",
                        sortable: false
                    },
                    {
                        text: "Ejercicio",
                        value: "ejercicio",
                        sortable: false
                    },
                    {
                        text: "Lactancia",
                        value: "lactancia",
                        sortable: false
                    },
                    {
                        text: "Niños menores de 5",
                        value: "ninosMenoresCinco",
                        sortable: false
                    },
                    {
                        text: "Meses lactancia",
                        value: "mesesLactancia",
                        sortable: false
                    },
                    {
                        text: "Peso",
                        value: "peso",
                        sortable: false
                    },
                    {
                        text: "Talla",
                        value: "talla",
                        sortable: false
                    },
                    {
                        text: "Diagnostico IMC",
                        value: "diagnosticoImc",
                        sortable: false
                    },
                    {
                        text: "Perimetro Braquial",
                        value: "PerimetroBraquial",
                        sortable: false
                    },
                    {
                        text: "Areas desnutrición",
                        value: "areasDesnutricion",
                        sortable: false
                    },
                    {
                        text: "Enfermedades",
                        value: "enfermedades",
                        sortable: false
                    },
                    {
                        text: "Cuales enfermedades",
                        value: "enfermedadesCuales",
                        sortable: false
                    },
                    {
                        text: "Tto enfermedades",
                        value: "ttoEnfermedades",
                        sortable: false
                    },
                    {
                        text: "No tto enfermedades",
                        value: "noTtoEnfermedades",
                        sortable: false
                    },
                    {
                        text: "Agente medicina",
                        value: "agenteMedicina",
                        sortable: false
                    },
				],
                tiposDocumentos: [
                    'Cédula de Ciudadanía',
                    'Tarjeta de Identidad',
                    'Cédula de Extranjería',
                    'Pasaporte',
                    'Registro Civil',
                ],
				sexos: ["1. Hombre", "2. Mujer", "3. Indeterminado"],
				afiliaciones: [
                    '1. Subsidiado',
					'2. Contributivo',
                    '3. Especial',
                    '4. Excepcion',
                    '5. No afiliado',
				],
				parentescos: [
					"Jefe(a) de familia",
					"Cónyuge o compañero(a)",
					"Hijo(a)",
					"Hermano(a)",
					"Padre o madre",
					"Otro",
				],
				ocupaciones: [
					'Empleado',
					'Trabajador independiente',
					'Ama de casa',
					'Jubilado, pensionado',
					'Desempleado',
					'Estudiante',
					'No aplica por edad',
				],
				pertenenciaItems: [
                    '1. Niñas, niños y adolescentes',
                    '2. Gestantes',
                    '3. Personas adulta mayor',
                    '4. Persona con condición de discapacidad',
                    '5. Personas con orientación sexual diversa',
                    '6. Victimas de violencia',
                    '7. Ninguna',
                ],
				escolaridad: [
					'Ninguno',
					'Primaria completa',
					'Primaria incompleta',
					'Secundaria completa',
					'Secundaria incompleta',
					'Técnica o tecnológica',
					'Universitaria',
					'Postgrado',
				],
				afiliacion: ['Contributivo', 'Subsidiado', 'Sisben', 'Ninguno'],
				atencionEspecial: [
					'Desplazados',
					'Afrodescendientes',
					'Indígenas',
					'No aplica',
				],
				discapacidad: [
                    'Física',
					'Auditiva',
					'Visual',
					'Sordoceguera',
					'Intelectual',
					'Psicosocial (Mental)',
                    'Multiple',
					'Ninguna',
					'Otra'
				],
                siNoItems: ['Si', 'No'],
                intervencionesItems: [
                    '1. Valoración Integral para la PYMS',
                    '2. Valoración integral por profesional en odontología para la PYMS',
                    '3. Promoción y apoyo a lactancia materna',
                    '4. Aplicación de flúor',
                    '5. Profilaxis y remoción de placa bacteriana',
                    '6. Vacunación de acuerdo con el esquema',
                    '7. Fortificación casera con micronutrientes en polvo',
                    '8. Suplementación con micronutrientes',
                    '9. Desparasitación intestinal antihelmíntica',
                    '10. Tamizaje para anemia - Hemoglobina y hematocrito',
                    '11. Planificación familiar y anticoncepción',
                    '12. Tamizaje de riesgo cardiovascular',
                    '13. Tamizaje para ITS',
                    '14. Tamizaje para cáncer de cuello uterino',
                    '15. Tamizaje para cáncer de mama',
                    '16. Tamizaje para cáncer de próstata',
                    '17. Tamizaje para cáncer de colon y recto',
                    '18. Atención para el cuidado preconcepcional',
                    '19. Atención para el cuidado prenatal – Controles prenatales',
                    '20. Curso de preparación para la maternidad y paternidad',
                    '21. Interrupción Voluntaria del Embarazo',
                    '22. Atención del puerperio',
                    '23. Atención para el seguimiento del recién nacido',
                    '24. Preparación para la maternidad y la paternidad',
                    '25. Educación para la salud',
                    '26. Ninguna'
                ],
                motivosItems:[
                    '1. Lugar de atención lejano, cerrado o ausencia del profesional de salud',
                    '2. Horarios de atención restringidos',
                    '3. Largos tiempos de espera',
                    '4. No había disponibilidad de la tecnología',
                    '5. Desconocimiento del derecho a las intervenciones de DTPE',
                    '6. Desconocimiento que las intervenciones son gratuitas',
                    '7. Persona enferma',
                    '8. Persona hospitalizada',
                    '9. Orden médica por enfermedad',
                    '10. Falta de tiempo del cuidador',
                    '11. Rechazo de la atención por tradición o cultura',
                    '12. No afiliado'
                ],
                imcItems:[
                    '1. Obesidad',
                    '2. Sobrepeso',
                    '3. Riesgo de sobrepeso',
                    '4. Peso adecuado para la talla',
                    '5. Riesgo de desnutrición aguda',
                    '6. Desnutrición aguda moderada',
                    '7. Desnutrición aguda severa',
                ],
                areasCuerpoItems:[
                    '1. Cabeza',
                    '2. Cara',
                    '3. Piel',
                    '4. Tórax y abdomen',
                    '5. Extremidades',
                    '6. Comportamiento'
                ],
                motivosNoTtoItems:[
                    '1. Lugar de atención lejano, cerrado o ausencia del profesional de salud',
                    '2. Horarios de atención restringidos',
                    '3. Largos tiempos de espera',
                    '4. No había disponibilidad de la tecnología',
                    '5. Falta de tiempo del cuidador',
                    'Tratamiento con remedios caseros',
                    '7. Rechazo de la atención por tradición o cultura',
                    '8. No afiliado'
                ],
                agenteItems:[
                    '1. Médico tradicional',
                    '2. Partera',
                    '3. Sabedor de la salud propia',
                    '4. No aplica',
                ],
                etniaItems:[
                    '1. Indígena',
                    '2. Rom (Gitano)',
                    '3. Raizal',
                    '4. Palenquero',
                    '5. Negro, Mulato, Afro',
                    '6. Otra',
                    '7. Ninguna'
                ]
			};
		},

		created(){
            let miembrosData = this.data.miembrosFamilia;

            if (!miembrosData || (typeof miembrosData === 'string' && JSON.parse(miembrosData).length === 0)) {

				this.form.miembrosFamilia = [];
				const afiliado = {
					id: 1,
                    primer_nombre: this.afiliado.primer_nombre,
                    segundoNombre: this.afiliado.segundo_nombre,
                    primerApellido: this.afiliado.primer_apellido,
                    segundoApellido: this.afiliado.segundo_apellido,
                    tipo_documento: this.afiliado.tipo_documento.nombre,
                    numero_documento: this.afiliado.numero_documento,
                    fecha_nacimiento: this.afiliado.fecha_nacimiento,
                    sexo: this.afiliado.sexo,
                    rol: '',
                    otroRol: '',
                    ocupacion: '',
                    nivelEscolaridad: '',
                    afiliacion: '',
                    eapb: '',
                    pertenencia: '',
                    etnia: '',
                    pueblo: '',
                    discapacidad: '',
                    saludCronica: '',
                    cumpleEsquema: '',
                    intervenciones: '',
                    motivos: '',
                    ejercicio: '',
                    lactancia: '',
                    ninosMenoresCinco: '',
                    mesesLactancia: '',
                    peso: '',
                    talla: '',
                    diagnosticoImc: '',
                    PerimetroBraquial: '',
                    areasDesnutricion: '',
                    enfermedades: '',
                    enfermedadesCuales: '',
                    ttoEnfermedades: '',
                    noTtoEnfermedades: '',
                    agenteMedicina: '',
                    esAfiliado: true
				};
				this.form.miembrosFamilia.push(afiliado);

				this.setEncuestaPsicosocial({
					...this.form
				});
			} else {
                this.form.miembrosFamilia = typeof miembrosData === 'string' ? JSON.parse(miembrosData) : miembrosData;
            }
		},

		computed: {
			...mapState("encuesta", ["data", "afiliado", "encuestaPsicosocial"]),

			miembrosCompletos() {
				return (this.form.miembrosFamilia || []);
			},

		},
		methods: {
			...mapMutations("encuesta", ["setEncuestaPsicosocial"]),
			...mapActions("encuesta", ["guardarDatos"]),

			obtenerNuevoMiembro() {
				return {
					id: Date.now(),
                    primer_nombre: '',
                    segundoNombre: '',
                    primerApellido: '',
                    segundoApellido: '',
                    tipo_documento: '',
                    numero_documento: '',
                    fecha_nacimiento: '',
                    sexo: '',
                    rol: '',
                    otroRol: '',
                    rol: '',
                    ocupacion: '',
                    nivelEscolaridad: '',
                    afiliacion: '',
                    eapb: '',
                    pertenencia: '',
                    etnia: '',
                    pueblo: '',
                    discapacidad: '',
                    saludCronica: '',
                    cumpleEsquema: '',
                    intervenciones: '',
                    motivos: '',
                    ejercicio: '',
                    lactancia: '',
                    ninosMenoresCinco: '',
                    mesesLactancia: '',
                    peso: '',
                    talla: '',
                    diagnosticoImc: '',
                    PerimetroBraquial: '',
                    areasDesnutricion: '',
                    enfermedades: '',
                    enfermedadesCuales: '',
                    ttoEnfermedades: '',
                    noTtoEnfermedades: '',
                    agenteMedicina: '',
                    esAfiliado: false,
				};
			},
			guardarMiembro() {
                if (!this.$refs.formFamilia || !this.$refs.formFamilia.validate()) {
                    this.$toast.error("Por favor, completa todos los campos requeridos.");
					return;
				}

				if (this.editando && this.editIndex !== null) {
					this.$set(this.form.miembrosFamilia, this.editIndex, {
						...this.formFamilia
					});
				} else {
					this.formFamilia.id = Date.now();
					this.form.miembrosFamilia.push({
						...this.formFamilia
					});
				}
                this.edit = false;
				this.actualizarVuex();
				this.cancelarEdicion();
				this.guardarEncuestaPsicosocial();
			},
			editarMiembro(index) {
				const miembro = this.form.miembrosFamilia[index];
				if (!miembro) {
					console.error("No se encontró el miembro en la lista.");
					return;
				}
                if(index === 0){
                    this.edit = true;
                }
				this.editIndex = index;
				this.formFamilia = { ...miembro };
				this.editando = true;
				this.mostrarFormulario = true;
                this.rojo = false;

			},
			eliminarMiembro(index) {
				if (index !== -1 && index < this.form.miembrosFamilia.length) {
					this.form.miembrosFamilia.splice(index, 1);
					this.actualizarVuex();
				}
			},
			cancelarEdicion() {
				this.mostrarFormulario = false;
				this.editando = false;
                this.edit = false;
				this.formFamilia = this.obtenerNuevoMiembro();
			},
			actualizarVuex() {
				this.$store.dispatch("encuesta/guardarDatos", {
					key: "datosGenerales",
					datos: this.form
				});
			},

			guardarEncuestaPsicosocial() {
                this.data.miembrosFamilia = this.form.miembrosFamilia;

				this.setEncuestaPsicosocial({
					...this.form
				});
			},

			scrollToTop() {
				window.scrollTo({
					top: 0,
					behavior: "smooth",
				});
			},

			guardar() {
				if (!this.$refs.form) {
					console.error("El formulario no está disponible");
					return;
				}

                if(!this.form.miembrosFamilia[0].agenteMedicina){
                    this.$toast.error("Por favor, completa todos los campos requeridos.");
                    this.rojo = true;
                    return;
                }

				this.guardarEncuestaPsicosocial();
				this.$emit("siguiente", this.form);
				this.$emit("completado", {
					stan: "EncuestaPsicosocial",
					completo: true,
				});
				this.scrollToTop();
			},

			volver() {
				this.guardarEncuestaPsicosocial();
				this.$emit("anterior");
			},
		},
	};

</script>

<style scoped>
    .rojo {
        border: 4px solid red;
        transition: border 0.3s ease-in-out;
    }
</style>
