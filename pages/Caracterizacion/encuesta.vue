<template>
	<div>
		<v-card elevation="0">
			<v-card-title>
				<v-toolbar flat>
					<v-toolbar-title>
						<div class="d-flex align-center">
							<img src="/images/ojo.svg" alt="" height="50px" width="50px" />
							<span>DIAGNÓSTICO DE LAS CONDICIONES SANITARIAS DE LA VIVIENDA A NIVEL FAMILIAR</span>
						</div>
					</v-toolbar-title>
					<v-divider class="mx-4" inset vertical></v-divider>
				</v-toolbar>
			</v-card-title>
			<v-card-text>
				<v-form ref="formCaracterizacion">
					<v-row class="mt-4">
						<v-col cols="12" md="8">
							<v-card-subtitle>
								¿Usted o su familia pertenecen a alguna organización comunitaria y/o participan en algún
								proyecto comunitario específico?
							</v-card-subtitle>
							<v-select dense outlined label="Seleccione una opción:" :items="['Sí', 'No']"
								v-model="form.organizacionComunitaria" />
						</v-col>
						<v-col cols="4" v-if="form.organizacionComunitaria === 'Sí'">
							<br>
							<v-card-subtitle>
								¿Cuál organización?
							</v-card-subtitle>
							<v-text-field dense outlined label="Escriba el nombre de la organización"
								v-model="form.nombreOrganizacion" />
						</v-col>
						<v-col cols="6">
							<v-text-field dense outlined type="number" label="¿Cuántas personas viven en la vivienda?"
								v-model="form.numeroPersonasResiden" />
						</v-col>
						<v-col cols="6">
							<v-text-field dense outlined type="number"
								label="¿Cuántas familias residen de manera habitual en esta vivienda?"
								v-model="form.numeroFamiliasQueResiden" />
						</v-col>


						<v-divider class="my-4"></v-divider>

						<v-card-title>
							Miembros de la familia
						</v-card-title>

						<v-subheader><i>La siguiente información debe ser diligenciada para cada una de las
								familias que residen en la vivienda y corresponde a las personas que comen y
								duermen habitualmente en este hogar, presentes o no</i></v-subheader>

					</v-row>

					<v-divider class="my-4"></v-divider>
					<v-row v-for="(miembro, index) in form.miembrosFamilia" :key="index" class="mb-4">
						<v-col cols="12" md="4">
							<v-text-field dense outlined label="Nombre y Apellidos" v-model="miembro.nombre" />
						</v-col>
						<v-col cols="12" md="2">
							<v-select dense outlined label="Sexo" :items="['Masculino', 'Femenino']"
								v-model="miembro.sexo" />
						</v-col>
						<v-col cols="12" md="2">
							<v-text-field dense outlined type="number" label="Edad" v-model="miembro.edad" />
						</v-col>
						<v-col cols="12" md="4">
							<v-select dense outlined label="Estado Civil"
								:items="['Soltero(a)', 'Casado(a)', 'Separado(a)', 'Viudo(a)', 'Unión libre']"
								v-model="miembro.estadoCivil" />
						</v-col>
						<v-col cols="12" md="4">
							<v-select dense outlined label="Parentesco"
								:items="['Jefe(a) de familia', 'Cónyuge o compañero(a)', 'Hijo(a)', 'Hermano(a)', 'Padre o madre', 'Otro']"
								v-model="miembro.parentesco" />
						</v-col>
						<v-col cols="12" md="4">
							<v-select dense outlined label="Ocupación"
								:items="['Empleado', 'Trabajador independiente', 'Ama de casa', 'Jubilado, pensionado', 'Desempleado', 'Estudiante', 'No aplica por edad']"
								v-model="miembro.ocupacion" />
						</v-col>
						<v-col cols="12" md="4">
							<v-select dense outlined label="Aporta ingresos económicos a la familia?"
								:items="['Si', 'No', 'No aplica']" v-model="miembro.aportaIngresos" />
						</v-col>
						<v-col cols="12" md="4">
							<v-select dense outlined label="Nivel de Escolaridad"
								:items="['Ninguno', 'Primaria completa', 'Primaria incompleta', 'Secundaria completa', 'Secundaria incompleta', 'Técnica o tecnológica', 'Universitaria', 'Postgrado']"
								v-model="miembro.nivelEscolaridad" />
						</v-col>
						<v-col cols="12" md="4">
							<v-select dense outlined label="Tipo de afiliación en salud"
								:items="['Contributivo', 'Subsidiado', 'Sisben', 'Ninguno']"
								v-model="miembro.tipoAfiliacionSalud" />
						</v-col>
						<v-col cols="12" md="4">
							<v-select dense outlined label="Grupo de atención especial"
								:items="['Desplazados', 'Afrodescendientes', 'Indígenas', 'No aplica']"
								v-model="miembro.grupoAtencionEspecial" />
						</v-col>
						<v-col cols="12" md="4">
							<v-select dense outlined label="Discapacidad"
								:items="['Motora', 'Auditiva', 'Visual', 'Del habla', 'Mental', 'Ninguna']"
								v-model="miembro.discapacidad" />
						</v-col>
						<v-col cols="12" class="d-flex justify-end">
							<v-btn color="red" dark @click="removeMiembro(index)">Eliminar Miembro <v-icon
									right>mdi-delete</v-icon></v-btn>
						</v-col>
					</v-row>
					<v-btn color="primary" dark @click="addMiembro">Agregar Miembro <v-icon
							right>mdi-plus</v-icon></v-btn>
					<v-divider class="my-4"></v-divider>

					<v-spacer></v-spacer>
					<v-card-title cols="12" md="4">
						Encuesta psicosocial
					</v-card-title>
					<v-divider class="my-4"></v-divider>
					<v-row>
						<v-col cols="12" md="4">
							<v-card-subtitle>
								¿En los últimos dos años usted y su familia han recibido algún tipo de ayuda o apoyo de
								alguna entidad u organización?
							</v-card-subtitle>
							<v-select dense outlined label="Seleccione una opción:" :items="['Sí', 'No']"
								v-model="form.ayudaComunitaria" />
						</v-col>
						<v-col cols="12" md="4" v-if="form.ayudaComunitaria === 'Sí'">
							<br><br>
							<v-card-subtitle>
								¿Cuál entidad u organización?
							</v-card-subtitle>
							<v-text-field dense outlined label="Escriba el nombre de la entidad"
								v-model="form.nombreOrganizacionAyuda" />
						</v-col>
						<v-col cols="12" md="4" v-if="form.ayudaComunitaria === 'Sí'">
							<br><br>
							<v-card-subtitle>
								¿Que tipo de ayuda?
							</v-card-subtitle>
							<v-text-field dense outlined label="Escriba el tipo de ayuda" v-model="form.tipoAyuda" />
						</v-col>
						<v-col cols="12" md="4">
							<v-card-subtitle>
								¿En la actualidad cuál considera que es la principal necesidad que tienen usted y su
								familia?
							</v-card-subtitle>
							<v-text-field dense outlined label="Escriba la necesidad" v-model="form.necesidadActual" />
						</v-col>
						<v-col cols="12" md="4">
							<v-card-subtitle>
								¿Ha sido usted y/o su familia desplazados por la violencia en los últimos diez años?
							</v-card-subtitle>
							<v-select dense outlined label="Seleccione una opción:" :items="['Sí', 'No']"
								v-model="form.desplazados" />
						</v-col>
						<v-col cols="12" md="4" v-if="form.desplazados === 'Sí'">
							<br>
							<v-card-subtitle>
								¿Hace cuánto tiempo?
							</v-card-subtitle>
							<v-text-field dense outlined type="number" label=" Escribe # de cantidad de meses"
								v-model="form.desplazadosTiempo" />
						</v-col>
						<v-col cols="12" md="4" v-if="form.desplazados === 'Sí'">
							<br>
							<v-card-subtitle>
								¿De qué lugar?
							</v-card-subtitle>
							<v-text-field dense outlined label="Lugar" v-model="form.desplazadosLugar" />
						</v-col>
						<v-col cols="12" md="4" v-if="form.desplazados === 'Sí'">
							<v-card-subtitle>
								¿Siente deseos de volver al sitio de donde fue desplazado?
							</v-card-subtitle>
							<v-select dense outlined label="selecciona una opción:" :items="['Sí', 'No']"
								v-model="form.deseoVolver" />
						</v-col>
						<v-col cols="12" md="4" v-if="form.desplazados === 'Sí'">
							<br><br>
							<v-card-subtitle>
								¿Por qué?
							</v-card-subtitle>
							<v-text-field dense outlined label="Escribe la razón" v-model="form.deseoPorque" />
						</v-col>
						<v-col cols="12" md="4" v-if="form.desplazados === 'Sí'">
							<br>
							<v-card-subtitle>
								Después del desplazamiento usted o su familia han sido rechazados o discriminados en:
							</v-card-subtitle>
							<v-select dense outlined label="Discriminados en:"
								:items="['El barrio o la comunidad', 'El trabajo', 'La escuela', 'En todas partes']"
								v-model="form.discriminadosEn" />
						</v-col>
						<v-col cols="12" md="4" v-if="form.desplazados === 'Sí'">
							<br>
							<v-card-subtitle>
								¿Qué cambios ha presentado la familia después del desplazamiento?
							</v-card-subtitle>
							<v-select dense outlined label="Cambios en:"
								:items="['Están más unidos', 'Se desintegró la familia', 'Hay problemas familiares', 'Ningún cambio']"
								v-model="form.cambiosEn" />
						</v-col>
						<v-col cols="12" md="4" v-if="form.desplazados === 'Sí'">
							<v-card-subtitle>
								¿Qué tan afectados de manera negativa considera que están usted y su familia como
								consecuencia del desplazamiento?
							</v-card-subtitle>
							<v-select dense outlined label="Afectados en:"
								:items="['Muy afectados', 'Poco afectados', 'Nada afectados']"
								v-model="form.afectadosEn" />
						</v-col>
						<v-col cols="12" md="4" v-if="form.desplazados === 'Sí'">
							<br>
							<v-card-subtitle>
								¿Considera que el desplazamiento ha sido en alguna manera positivo para usted y su
								familia?
							</v-card-subtitle>
							<v-select dense outlined label="Seleccione una opción:"
								:items="['Muy positivo', 'Poco positivo', 'Nada positivo']" v-model="form.positivo" />
						</v-col>
						<v-col cols="12" md="4">
							<v-card-subtitle>
								¿Se siente a gusto en la vivienda que habita actualmente?
							</v-card-subtitle>
							<v-select dense outlined label="selecciona una opción:" :items="['Sí', 'No']"
								v-model="form.gustoVivienda" />
						</v-col>
						<v-col cols="12" md="4">
							<br>
							<v-card-subtitle>
								¿Por qué?
							</v-card-subtitle>
							<v-text-field dense outlined label="Escribe la razón" v-model="form.gustoPorque" />
						</v-col>
						<v-col cols="12" md="4">
							<v-card-subtitle>
								¿Cuándo su familia se encuentra dentro de la casa, en que lugar prefieren estar la mayor
								parte del tiempo?
							</v-card-subtitle>
							<v-select dense outlined label="selecciona una opción:"
								:items="['En la sala', 'En la cocina', 'En la habitación', 'Otro']"
								v-model="form.lugarPrefieren" />
						</v-col>
						<v-col cols="12" md="4">
							<v-card-subtitle>
								Cuándo consumen los alimentos en su familia, lo hacen:
							</v-card-subtitle>
							<v-select dense outlined label="selecciona una opción:"
								:items="['Reunidos en familia', 'Cada quién por separado']" v-model="form.comoCenan" />
						</v-col>
						<v-col cols="12" md="4">
							<v-card-subtitle>
								¿Al interior de su familia se presentan o se han presentado casos de maltrato o
								violencia?
							</v-card-subtitle>
							<v-select dense outlined label="selecciona una opción:" :items="['Sí', 'No']"
								v-model="form.violencia" />
						</v-col>
						<v-col cols="12" md="4" v-if="form.violencia === 'Sí'">
							<v-card-subtitle>
								En caso de responder SI a la anterior pregunta ¿Ha pedido ayuda o ha denunciado estos
								casos?
							</v-card-subtitle>
							<v-select dense outlined label="selecciona una opción:" :items="['Sí', 'No']"
								v-model="form.ayudaViolencia" />
						</v-col>
						<v-col cols="12" md="4" v-if="form.violencia === 'Sí' && form.ayudaViolencia === 'No'">
							<br>
							<v-card-subtitle>
								¿Por qué no ah pedido ayuda?
							</v-card-subtitle>
							<v-text-field dense outlined label="Escriba la razón." v-model="form.noAyudaViolencia" />
						</v-col>
						<v-col cols="12" md="4">
							<v-card-subtitle>
								¿Cómo se toman las decisiones más importantes en su familia?
							</v-card-subtitle>
							<v-select dense outlined label="selecciona una opción:"
								:items="['Con diálogo ', 'Es decisión del padre', 'Es decisión de la madre', 'Otro']"
								v-model="form.decisiones" />
						</v-col>
						<v-col cols="12" md="4" v-if="form.decisiones === 'Otro'">
							<br>
							<v-card-subtitle>
								¿Cual?
							</v-card-subtitle>
							<v-text-field dense outlined label="Escriba la otra manera." v-model="form.otraDecision" />
						</v-col>
						<v-col cols="12" md="4">
							<v-card-subtitle>
								¿Cómo se corrigen o resuelven usualmente los problemas en su familia?
							</v-card-subtitle>
							<v-select dense outlined label="selecciona una opción:"
								:items="['Con diálogo ', 'Con sanción o supresión', 'Con castigo verbal', 'Con castigo físico', 'No aplica']"
								v-model="form.corrigenProblemasCasa" />
						</v-col>
						<v-col cols="12" md="4">
							<br>
							<v-card-subtitle>
								¿Cómo se resuelven los problemas en su comunidad?
							</v-card-subtitle>
							<v-select dense outlined label="selecciona una opción:"
								:items="['Con diálogo ', 'Por medio de la fuerza o represión', ' Por consenso', 'Con violencia', 'Otro']"
								v-model="form.corrigenProblemasComunidad" />
						</v-col>
						<v-col cols="12" md="4" v-if="form.corrigenProblemasComunidad === 'Otro'">
							<br>
							<v-card-subtitle>
								¿Cual?
							</v-card-subtitle>
							<v-text-field dense outlined label="Escriba la otra manera."
								v-model="form.otraDecisionComunidad" />
						</v-col>
						<v-col cols="12" md="4">
							<br>
							<v-card-subtitle>
								¿Considera que necesita capacitarse?
							</v-card-subtitle>
							<v-select dense outlined label="selecciona una opción:" :items="['Sí', 'Nó']"
								v-model="form.capacitarse" />
						</v-col>
						<v-col cols="12" md="4">
							<br>
							<v-card-subtitle>
								¿Le gustaría emprender un negocio?
							</v-card-subtitle>
							<v-select dense outlined label="selecciona una opción:" :items="['Sí', 'Nó']"
								v-model="form.negocio" />
						</v-col>
						<v-col cols="12" md="4">
							<br>
							<v-card-subtitle>
								¿Cómo cree que serán las condiciones de vida de usted y su familia en un año?
							</v-card-subtitle>
							<v-select dense outlined label="selecciona una opción:"
								:items="['Seguirán siendo iguales ', 'Mejorarán', 'Empeorarán']"
								v-model="form.condicionesAno" />
						</v-col>
					</v-row>
					<v-divider class="my-4"></v-divider>
					<v-container>
						<v-row>
							<v-col cols="12" md="6">
								<v-card-title>
									A continuación le indicaré una serie de molestias relacionadas con salud, por
									favor
									responda si usted o algún miembro de su familia cercana ha tenido cambios en su
									comportamiento habitual en los últimos seis (6) meses.
								</v-card-title>
								<v-card-text>

									<v-row v-for="(sintoma, index) in sintomasAdultos" :key="index">
										<v-col cols="12">
											<v-checkbox :label="sintoma"
												v-model="form.sintomasAdultos[index]"></v-checkbox>
										</v-col>
									</v-row>
								</v-card-text>
							</v-col>
							<v-divider class="mx-4" inset vertical></v-divider>

							<v-col cols="12" md="5">
								<v-card-title>
									¿En su hogar, alguno de los menores de 15 años ha tenido cambios en su
									comportamiento habitual en los últimos seis (6) meses?
								</v-card-title>
								<v-card-text>
									<v-row v-for="(sintoma, index) in sintomasMenores" :key="index">
										<v-col cols="12">
											<v-checkbox :label="sintoma"
												v-model="form.sintomasMenores[index]"></v-checkbox>
										</v-col>
									</v-row>
								</v-card-text>
							</v-col>
						</v-row>
						<v-divider class="my-4"></v-divider>
						<v-row>

							<v-col cols="12" md="6">
								<v-card-title>
									Usted o alguien de la familia que convive con usted:
								</v-card-title>
								<v-card-text>
									<v-row v-for="(vicio, index) in vicios" :key="index">
										<v-col cols="12">
											<v-checkbox :label="vicio" v-model="form.vicios[index]"></v-checkbox>
										</v-col>
									</v-row>
								</v-card-text>
							</v-col>
							<v-divider class="mx-4" inset vertical></v-divider>
							<v-col cols="12" md="5">
								<br>
								<v-card-subtitle>
									¿A qué dedica su familia el tiempo libre?
								</v-card-subtitle>
								<v-select dense outlined label="selecciona una opción:"
								:items="['Hacer reuniones familiares', 'Paseos', 'Practicar algún tipo de deporte', 'Otro']"
									v-model="form.capacitarse" />

								<br>
								<v-card-subtitle>
									En la actualidad considera que Usted:
								</v-card-subtitle>
								<v-select dense outlined label="selecciona una opción:"
								:items="['Es felíz', 'No es feliz']"
									v-model="form.capacitarse" />
							</v-col>
						</v-row>
					</v-container>
					<v-divider class="my-4"></v-divider>

					<v-spacer></v-spacer>
					<v-card-title cols="12" md="4">
						Vivienda
					</v-card-title>
					<v-divider class="my-4"></v-divider>
					<v-row>
						<v-col cols="12" md="6">
							<v-select dense outlined label="La vivienda ocupada por este hogar es:"
								:items="['Propia, totalmente pagada', 'Propia, la están pagando', 'En arriendo', 'Otra']"
								v-model="form.tenenciaVivienda" />
						</v-col>
						<v-col cols="12" v-if="form.tenenciaVivienda === 'En arriendo'">
							<v-text-field dense outlined label="Valor del arriendo ($)" v-model="form.valorArriendo" />
						</v-col>
						<v-col cols="12" v-if="form.tenenciaVivienda === 'Otra'">
							<v-text-field dense outlined label="Especifique" v-model="form.otraTenencia" />
						</v-col>
						<v-col cols="12" md="6">
							<v-select dense outlined label="El lote donde está ubicada la vivienda es legalizado:"
								:items="['Sí', 'No']" v-model="form.loteLegalizado" />
						</v-col>
						<v-col cols="12" md="6">
							<v-text-field dense outlined label="Estrato de la vivienda"
								v-model="form.estratoVivienda" />
						</v-col>
						<v-col cols="12" md="6">
							<v-select dense outlined label="¿Se realiza algún trabajo o negocio que genere ingresos?"
								:items="['Sí', 'No']" v-model="form.trabajoEnVivienda" />
						</v-col>
						<v-col cols="12" v-if="form.trabajoEnVivienda === 'Sí'">
							<v-text-field dense outlined label="¿Cuál?" v-model="form.tipoTrabajoEnVivienda" />
						</v-col>
						<v-col cols="12" md="6">
							<v-select dense outlined label="Ingresos mensuales promedio de la familia"
								:items="['Menos de un salario mínimo', '1 salario mínimo', 'Más de 1 salario mínimo']"
								v-model="form.ingresosFamilia" />
						</v-col>
						<v-col cols="12" md="6">
							<v-text-field dense outlined label="Promedio de gastos en servicios públicos ($)"
								v-model="form.gastosServicios" />
						</v-col>
					</v-row>

					<!-- Sección D: Morbilidad Sentida -->
					<v-divider class="my-4"></v-divider>
					<v-row>
						<v-col cols="12" md="6">
							<v-select dense outlined label="¿En la vivienda hay niños menores de cinco años?"
								:items="['Sí', 'No']" v-model="form.ninosMenoresCinco" />
						</v-col>
						<v-col cols="12" v-if="form.ninosMenoresCinco === 'Sí'">
							<v-text-field dense outlined label="¿Cuáles son los accidentes más frecuentes en los niños?"
								v-model="form.accidentesNinos" />
							<v-text-field dense outlined label="Edad promedio de alimentación con leche materna (meses)"
								v-model="form.edadLecheMaterna" />
							<v-select dense outlined label="¿Tienen el esquema de vacunación completo?"
								:items="['Sí', 'No']" v-model="form.vacunacionCompleta" />
							<v-text-field v-if="form.vacunacionCompleta === 'No'" dense outlined label="¿Por qué razón?"
								v-model="form.razonNoVacunacion" />
							<v-select dense outlined label="¿Ha purgado al niño en el último año?" :items="['Sí', 'No']"
								v-model="form.purgadoUltimoAno" />
							<v-text-field v-if="form.purgadoUltimoAno === 'Sí'" dense outlined label="¿Cuántas veces?"
								v-model="form.vecesPurgado" />
						</v-col>
					</v-row>

					<!-- Botón de envío -->
					<v-divider class="my-4"></v-divider>
					<v-btn color="success" dark @click="submitForm">Enviar <v-icon right>mdi-send</v-icon></v-btn>
				</v-form>
			</v-card-text>
		</v-card>
	</div>
</template>

<script>
export default {
	data() {
		return {
			form: {
				nombreEncuestador: '',
				fecha: '',
				horaInicio: '',
				horaCulminacion: '',
				supervisor: '',
				nombreEncuestado: '',
				sexo: '',
				edad: '',
				direccion: '',
				barrio: '',
				municipio: '',
				telefono: '',
				organizacionComunitaria: '',
				nombreOrganizacion: '',
				tenenciaVivienda: '',
				valorArriendo: '',
				otraTenencia: '',
				loteLegalizado: '',
				estratoVivienda: '',
				trabajoEnVivienda: '',
				tipoTrabajoEnVivienda: '',
				ingresosFamilia: '',
				gastosServicios: '',
				ninosMenoresCinco: '',
				accidentesNinos: '',
				edadLecheMaterna: '',
				vacunacionCompleta: '',
				razonNoVacunacion: '',
				purgadoUltimoAno: '',
				vecesPurgado: '',
				miembrosFamilia: [],
				sintomasAdultos: Array(8).fill(false),
				sintomasMenores: Array(8).fill(false),
				vicios: Array(3).fill(false),
			},
			sintomasAdultos: [
				'Nerviosismo',
				'Intranquilidad',
				'¿Ha tenido problemas para dormir?',
				'¿Siente deseos de llorar frecuentemente?',
				'¿Siente una tristeza profunda?',
				'¿Últimamente ha abusado de bebidas alcohólicas?',
				'¿Últimamente ha comenzado a fumar o ha aumentado el consumo?',
				'¿En la actualidad desconfía más de la gente que antes?'
			],
			sintomasMenores: [
				'¿Juega o se divierte menos?',
				'¿Se observa triste o diferente?',
				'¿Ha cambiado el trato hacia otras personas adultas?',
				'¿Presenta problemas en la relación con otros niños?',
				'¿Llora fácilmente?',
				'¿Está más inquieto o intranquilo?',
				'¿Deja la escuela o ya no quiere estudiar?',
				'¿Se altera de manera exagerada con algunas cosas o situaciones?'
			],
			vicios: [
				'¿Fuma cigarrillo y/o tabaco?',
				'¿Consume bebidas alcohólicas?',
				'¿Consume medicamentos para dormir y/o calmar los nervios?'
			],
			rules: {
				obligatorio: v => !!v || 'Este campo es obligatorio'
			}
		};
	},
	methods: {
		addMiembro() {
			this.form.miembrosFamilia.push({
				nombre: '',
				sexo: '',
				edad: '',
				estadoCivil: '',
				parentesco: '',
				ocupacion: '',
				aportaIngresos: '',
				nivelEscolaridad: '',
				tipoAfiliacionSalud: '',
				grupoAtencionEspecial: '',
				discapacidad: ''
			});
		},
		removeMiembro(index) {
			this.form.miembrosFamilia.splice(index, 1);
		},
		submitForm() {
			console.log('Formulario enviado:', this.form);
			this.$axios
				.post("/afiliados/crearCaracterizacion", this.form)
				.then((res) => {
					this.$toast.success("Caracterización guardada con éxito");
				})
				.catch((e) => {
					this.$toast.error("Ocurrió un error al guardar la caracterización");
					console.error(e);
				})
				.finally(() => {
					this.preload = false;
				});
		}
	}
};
</script>
