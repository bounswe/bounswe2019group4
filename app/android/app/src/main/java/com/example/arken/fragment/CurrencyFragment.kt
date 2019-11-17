package com.example.arken.fragment

import android.annotation.SuppressLint
import android.content.Context.MODE_PRIVATE
import android.content.SharedPreferences
import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageButton
import android.widget.TextView
import androidx.constraintlayout.widget.ConstraintLayout
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


class CurrencyFragment : Fragment(), View.OnClickListener {

    private var loggedIn: Boolean = false
    private lateinit var prefs: SharedPreferences
    private lateinit var currencyName: TextView
    private lateinit var predictionValue: TextView
    private lateinit var currencyValue: TextView
    private lateinit var followButton: ImageButton
    private lateinit var weekButton: Button
    private lateinit var monthwButton: Button
    private lateinit var yearButton: Button
    private lateinit var predictionUpButton: ImageButton
    private lateinit var predictionDownButton: ImageButton
    private lateinit var currencyTime: TextView
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
        val layout: ConstraintLayout = view.findViewById(R.id.curBack)
        layout.setOnClickListener(this)
        currencyValue = view.findViewById(R.id.currencyValue)
        currencyName = view.findViewById(R.id.currencyName)
        currencyTime = view.findViewById(R.id.currencyTime)
        recyclerView = view.findViewById(R.id.currencyValueRecyclerView)
        recyclerView.layoutManager = LinearLayoutManager(activity)
        predictionDownButton = view.findViewById(R.id.prediction_downButton)
        predictionUpButton = view.findViewById(R.id.prediction_upButton)
        predictionValue = view.findViewById(R.id.predictionRate)
        followButton = view.findViewById(R.id.follow_button)
        weekButton = view.findViewById(R.id.week)
        monthwButton = view.findViewById(R.id.month)
        yearButton = view.findViewById(R.id.year)
        yearButton.setOnClickListener(this)
        monthwButton.setOnClickListener(this)
        weekButton.setOnClickListener(this)
        followButton.setOnClickListener(this)
        recyclerView.setHasFixedSize(true)
        currencyValueAdapter = CurrencyValueAdapter()
        recyclerView.adapter = currencyValueAdapter
        tradingEquipmentViewModel =
            ViewModelProviders.of(this).get(TradingEquipmentViewModel::class.java)
        tradingEquipmentViewModel.data.observe(this, Observer<Currency> {
            currencyTime.text = it.current!!.Date.toString()
            currencyValue.text = it.current!!.rate
            currencyName.text = "${it.current!!.from}/${it.current!!.to}"
            predictionValue.text =
                "%" + (it.numberOfUps!!.toDouble().div(it.numberOfDowns!! + it.numberOfUps!!)) + " up"
            currencyValueAdapter.setData(it)
            if (it.following!!) {
                followButton.setBackgroundColor(Color.BLUE)
            } else {
                followButton.setBackgroundColor(Color.WHITE)
            }
            currencyValueAdapter.notifyDataSetChanged()

        })
        name = args.codeOfCurrency
        return view
    }

    override fun onClick(v: View?) {
        System.out.println("click works")
        when (v!!.id) {
            R.id.follow_button -> if (loggedIn) {
                tradingEquipmentViewModel.followUnfollow(
                    prefs.getString(
                        "cookie",
                        "null"
                    )!!, args.codeOfCurrency, tradingEquipmentViewModel.data.value?.following!!
                )
            }
        }
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        prefs = getActivity()!!.getSharedPreferences("MyPrefsFile", MODE_PRIVATE)
        loggedIn = !prefs.getString("cookie", "null").equals("null")
        tradingEquipmentViewModel.setData(name, prefs.getString("cookie", null))
    }

}
