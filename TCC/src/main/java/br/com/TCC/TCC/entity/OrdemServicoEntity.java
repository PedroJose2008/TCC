package br.com.TCC.TCC.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "OrdemServico")
public class OrdemServicoEntity implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@NotNull
	private int id;
	
	@ManyToOne
<<<<<<< HEAD
	@JoinColumn(name = "idCliente")
	@NotNull
	private ClienteEntity cliente;
	
=======
	@JoinColumn(name = "cliente_id")
	private ClienteEntity cliente;
>>>>>>> branch 'master' of https://github.com/PedroJose2008/TCC.git
	
	@ManyToOne
	@JoinColumn(name = "idUsuario")
	@NotNull
	private UsuarioEntity usuario;
	
	@ManyToOne
	@JoinColumn(name = "idTipoPagamento")
	@NotNull
	private TipoPagamentoEntity tipoPagamento;
	
	@ManyToOne
	@JoinColumn(name = "idKit")
	@NotNull
	private KitEntity kit;
	
	
	@ManyToMany
	@JoinTable(
	    name = "ordem_servico_pecas",
	    joinColumns = @JoinColumn(name = "ordem_id"),
	    inverseJoinColumns = @JoinColumn(name = "peca_id")
	)
	private List<PecaEntity> pecas;
	
	@NotNull
	@Column(precision = 5, scale = 2)
	private BigDecimal valor;
	
	private LocalDate dataAbertura;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

<<<<<<< HEAD

	
	
=======
>>>>>>> branch 'master' of https://github.com/PedroJose2008/TCC.git
	

	public ClienteEntity getCliente() {
		return cliente;
	}

	public void setCliente(ClienteEntity cliente) {
		this.cliente = cliente;
	}

	

<<<<<<< HEAD
	
	

=======
>>>>>>> branch 'master' of https://github.com/PedroJose2008/TCC.git
	public UsuarioEntity getUsuario() {
		return usuario;
	}

	public void setUsuario(UsuarioEntity usuario) {
		this.usuario = usuario;
	}

	public TipoPagamentoEntity getTipoPagamento() {
		return tipoPagamento;
	}

	public void setTipoPagamento(TipoPagamentoEntity tipoPagamento) {
		this.tipoPagamento = tipoPagamento;
	}

	public KitEntity getKit() {
		return kit;
	}

	public void setKit(KitEntity kit) {
		this.kit = kit;
	}

	

	public List<PecaEntity> getPecas() {
		return pecas;
	}

	public void setPecas(List<PecaEntity> pecas) {
		this.pecas = pecas;
	}

	public BigDecimal getValor() {
		return valor;
	}

	public void setValor(BigDecimal valor) {
		this.valor = valor;
	}

	public LocalDate getDataAbertura() {
		return dataAbertura;
	}

	public void setDataAbertura(LocalDate dataAbertura) {
		this.dataAbertura = dataAbertura;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	
	
}
