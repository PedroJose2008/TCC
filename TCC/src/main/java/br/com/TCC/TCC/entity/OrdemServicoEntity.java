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


@Entity
@Table(name = "OrdemServico")
public class OrdemServicoEntity implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	
	private int id;
	

	
	@ManyToOne
	@JoinColumn(name = "idCliente")
	private ClienteEntity cliente;
	

	

	
	@ManyToOne
	@JoinColumn(name = "idUsuario")
	
	private UsuarioEntity usuario;
	
	private String pagamento;
	
	@ManyToOne
	@JoinColumn(name = "idKit")
	
	private KitEntity kit;
	
	
	@ManyToMany
	@JoinTable(
	    name = "ordem_servico_pecas",
	    joinColumns = @JoinColumn(name = "ordem_id"),
	    inverseJoinColumns = @JoinColumn(name = "peca_id")
	)
	private List<PecaEntity> pecas;
	
	
	@Column(precision = 5, scale = 2)
	private BigDecimal valor;
	
	private LocalDate dataAbertura;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}


	public ClienteEntity getCliente() {
		return cliente;
	}

	public void setCliente(ClienteEntity cliente) {
		this.cliente = cliente;
	}



	public UsuarioEntity getUsuario() {
		return usuario;
	}

	public void setUsuario(UsuarioEntity usuario) {
		this.usuario = usuario;
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

	public String getPagamento() {
		return pagamento;
	}

	public void setPagamento(String pagamento) {
		this.pagamento = pagamento;
	}
	
	
	
}
