package com.example.arken.fragment

import android.annotation.SuppressLint
import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.tradingEquipment.Currency
import com.example.arken.util.CurrencyValueAdapter
import com.example.arken.viewModel.TradingEquipmentViewModel


class CurrencyFragment : Fragment() {
    private lateinit var currencyName:TextView
    private lateinit var predictionValue:TextView
    private lateinit var currencyValue:TextView
    private lateinit var followButton: ImageButton
    private lateinit var predictionUpButton: ImageButton
    private lateinit var predictionDownButton: ImageButton
    private lateinit var currencyTime:TextView
    private lateinit var tradingEquipmentViewModel: TradingEquipmentViewModel
    private val args: CurrencyFragmentArgs by navArgs()
    private lateinit var recyclerView: RecyclerView
    private lateinit var currencyValueAdapter: CurrencyValueAdapter
    private lateinit var name: String
    @SuppressLint("ClickableViewAccessibility")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_currency, container, false)
        currencyValue=view.findViewById(R.id.currencyValue)
        currencyName=view.findViewById(R.id.currencyName)
        currencyTime=view.findViewById(R.id.currencyTime)
        recyclerView = view.findViewById(R.id.currencyValueRecyclerView)
        recyclerView.layoutManager = LinearLayoutManager(activity)
        predictionDownButton=view.findViewById(R.id.prediction_downButton)
        predictionUpButton=view.findViewById(R.id.prediction_upButton)
        predictionValue=view.findViewById(R.id.predictionRate)
        followButton=view.findViewById(R.id.follow_button)
        recyclerView.setHasFixedSize(true)
        currencyValueAdapter = CurrencyValueAdapter()
        recyclerView.adapter = currencyValueAdapter
        tradingEquipmentViewModel =
            ViewModelProviders.of(this).get(TradingEquipmentViewModel::class.java)
        tradingEquipmentViewModel.data.observe(this, Observer<Currency> {
            currencyTime.text=it.current!!.Date.toString()
            currencyValue.text=it.current!!.rate
            currencyName.text=it.current!!.from+"/"+it.current!!.to
            predictionValue.text="%"+(it.numberOfUps!!.toDouble().div(it.numberOfDowns!! + it.numberOfUps!!))+" up"
            currencyValueAdapter.setData(it)
            currencyValueAdapter.notifyDataSetChanged()
        })
        name = args.codeOfCurrency
        tradingEquipmentViewModel.setData(name)
        return view
    }


    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

    }
}
