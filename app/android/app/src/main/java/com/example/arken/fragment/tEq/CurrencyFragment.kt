package com.example.arken.fragment.tEq

import android.annotation.SuppressLint
import android.content.Context.MODE_PRIVATE
import android.content.SharedPreferences
import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.core.widget.NestedScrollView
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.anychart.AnyChartView
import com.example.arken.R
import com.example.arken.fragment.comment.ListCommentFragment
import com.example.arken.model.tradingEquipment.Currency
import com.example.arken.util.CurrencyValueAdapter
import com.example.arken.viewModel.TradingEquipmentViewModel
import java.math.RoundingMode

class CurrencyFragment : Fragment(), View.OnClickListener {

    private var loggedIn: Boolean = false
    private lateinit var anyChartView: AnyChartView
    private lateinit var prefs: SharedPreferences
    private lateinit var currencyName: TextView
    private lateinit var predictionValue: TextView
    private lateinit var currencyValue: TextView
    lateinit var followButton: ImageButton
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
        val layout: NestedScrollView = view.findViewById(R.id.curBack)
        layout.setOnClickListener(this)
        anyChartView = view.findViewById(R.id.any_chart_view)
        anyChartView.setBackgroundColor("#161c1d")
        currencyValue = view.findViewById(R.id.currencyValue)
        currencyName = view.findViewById(R.id.currencyName)
        currencyTime = view.findViewById(R.id.currencyTime)
        recyclerView = view.findViewById(R.id.currencyValueRecyclerView)
        recyclerView.layoutManager = LinearLayoutManager(activity)
        predictionDownButton = view.findViewById(R.id.prediction_downButton)
        predictionUpButton = view.findViewById(R.id.prediction_upButton)
        predictionValue = view.findViewById(R.id.predictionRate)
        followButton = view.findViewById(R.id.follow_button)
        predictionUpButton.setOnClickListener(this)
        predictionDownButton.setOnClickListener(this)
        followButton.setOnClickListener(this)
        recyclerView.setHasFixedSize(true)
        currencyValueAdapter = CurrencyValueAdapter()
        recyclerView.adapter = currencyValueAdapter
        tradingEquipmentViewModel =
            ViewModelProviders.of(this).get(TradingEquipmentViewModel::class.java)
        tradingEquipmentViewModel.data.observe(this, Observer<Currency> {
            currencyTime.text = it.current!!.Date.toString()
            currencyValue.text =
                it.current!!.rate.toBigDecimal().setScale(4, RoundingMode.HALF_EVEN).toString()
            currencyName.text = "${it.current!!.from}/${it.current!!.to}"
            if (it.current!!.rate.toDouble() >= it.values!![0].close!!.toDouble()) {
                currencyName.setTextColor(Color.GREEN)
                currencyValue.setTextColor(Color.GREEN)
            } else {
                currencyName.setTextColor(Color.RED)
                currencyValue.setTextColor(Color.RED)
            }

            if (it.numberOfUps!!.toDouble().div(it.numberOfDowns!! + it.numberOfUps!!).isNaN()) {
                predictionValue.text = "%0.00 up"
            } else {
                predictionValue.text =
                    "%${it.numberOfUps!!.toDouble().div(it.numberOfDowns!! + it.numberOfUps!!).times(
                        100
                    ).toBigDecimal().setScale(2, RoundingMode.HALF_EVEN)} up"
            }
            currencyValueAdapter.setData(it)
            anyChartView.setChart(tradingEquipmentViewModel.setChart(2))
            if (it.following!!) {
                followButton.setImageResource(R.drawable.ic_check_circle_blue)
            } else {
                followButton.setImageResource(R.drawable.ic_check_circle)
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
                followButtonPressed(tradingEquipmentViewModel.data.value?.following!!)
            } else {
                Toast.makeText(context, "You need to login to use this action", Toast.LENGTH_SHORT)
                    .show()
            }
            R.id.prediction_upButton -> if (loggedIn) {
                predictionButtonPressed(true)
            } else {
                Toast.makeText(context, "You need to login to use this action", Toast.LENGTH_SHORT)
                    .show()
            }
            R.id.prediction_downButton -> if (loggedIn) {
                predictionButtonPressed(false)
            } else {
                Toast.makeText(context, "You need to login to use this action", Toast.LENGTH_SHORT)
                    .show()
            }
        }
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        prefs = getActivity()!!.getSharedPreferences("MyPrefsFile", MODE_PRIVATE)
        loggedIn = !prefs.getString("user_cookie", "null").equals("null")
        tradingEquipmentViewModel.setData(name, prefs.getString("user_cookie", null))
        fragmentManager?.beginTransaction()?.add(
            R.id.list_comment_fragment_currency,
            ListCommentFragment.newInstance(
                name,
                "TRADING-EQUIPMENT"
            ),
            "commentList"
        )?.commit()

    }

    private fun followButtonPressed(isFollowing: Boolean) {

        val builder1 =
            AlertDialog.Builder(context!!)
        if (isFollowing) {
            builder1.setMessage(R.string.teq_unfollow_warning)
        } else {
            builder1.setMessage(R.string.teq_follow_warning)
        }
        builder1.setCancelable(true)
        builder1.setPositiveButton(
            "Yes"
        ) { dialog, id ->
            dialog.cancel()
            tradingEquipmentViewModel.followUnfollow(
                prefs.getString(
                    "user_cookie",
                    "null"
                )!!, args.codeOfCurrency, isFollowing
            )
            follow(!tradingEquipmentViewModel.data.value?.following!!)
        }


        builder1.setNegativeButton(
            "No"
        ) { dialog, id -> dialog.cancel() }
        val alert11 = builder1.create()
        alert11.show()

    }

    private fun predictionButtonPressed(isUp: Boolean) {
        val builder1 =
            AlertDialog.Builder(context!!)
        if (isUp) {
            builder1.setMessage(R.string.teq_upPrediction_warning)
        } else {
            builder1.setMessage(R.string.teq_downPrediction_warning)
        }
        builder1.setCancelable(true)
        builder1.setPositiveButton(
            "Yes"
        ) { dialog, id ->
            dialog.cancel()
            tradingEquipmentViewModel.prediction(
                prefs.getString(
                    "user_cookie",
                    "null"
                )!!, args.codeOfCurrency, isUp
            )

        }
        builder1.setNegativeButton(
            "No"
        ) { dialog, id -> dialog.cancel() }
        val alert11 = builder1.create()
        alert11.show()
    }

    fun follow(isFollowing: Boolean) {
        if (isFollowing) {
            followButton.setImageResource(R.drawable.ic_check_circle_blue)
        } else {
            followButton.setImageResource(R.drawable.ic_check_circle)
        }
    }
}
