package com.example.arken.fragment.article

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.graphics.Color
import android.os.Bundle
import android.text.SpannableString
import android.text.Spanned
import android.text.TextPaint
import android.text.method.KeyListener
import android.text.method.LinkMovementMethod
import android.text.style.BackgroundColorSpan
import android.text.style.ClickableSpan
import android.view.*
import android.widget.*
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.example.arken.R
import com.example.arken.model.Article
import com.example.arken.model.ArticleCreateRequest
import com.example.arken.model.ArticleRateRequest
import com.example.arken.util.RetroClient
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class ArticleDetail : Fragment(), AdapterView.OnItemSelectedListener {
    private lateinit var editButton: Button
    private lateinit var deleteButton: Button
    private lateinit var saveButton: Button
    private lateinit var title: TextView
    private var rate: Int? = null
    private lateinit var rateSpinner: Spinner
    private lateinit var text: TextView
    private lateinit var vote: Button
    private lateinit var currentRate: TextView
    private lateinit var myVote: TextView
    private lateinit var totalVotes: TextView
    private val args: ArticleDetailArgs by navArgs()
    private lateinit var prefs: SharedPreferences
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val rootView = inflater.inflate(R.layout.fragment_article_details, container, false)
        title = rootView.findViewById(R.id.article_detail_title)
        text = rootView.findViewById(R.id.article_detail_text)
        saveButton = rootView.findViewById(R.id.articleeditsave)
        title.tag = title.keyListener
        title.keyListener = null
        text.tag = text.keyListener
        text.keyListener = null
        editButton = rootView.findViewById(R.id.edit_article_button)
        deleteButton = rootView.findViewById(R.id.delete_article_button)
        vote = rootView.findViewById(R.id.rate_line_vote_button)
        currentRate = rootView.findViewById(R.id.rate_line_current_rate)
        myVote = rootView.findViewById(R.id.rate_line_my_vote)
        totalVotes= rootView.findViewById(R.id.rate_line_total_votes)
        vote.setOnClickListener { vote() }
        rateSpinner = rootView.findViewById(R.id.rate_line_vote_spinner)

        val imp = arrayOf(1, 2, 3, 4, 5)

        ArrayAdapter(
            context!!,
            R.layout.custom_spinner, imp
        ).also { adapter ->
            // Specify the layout to use when the list of choices appears
            // Apply the adapter to the spinner
            rateSpinner.adapter = adapter
        }

        rateSpinner.onItemSelectedListener = this
        rateSpinner.setSelection(0)

        return rootView
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        prefs = getActivity()!!.getSharedPreferences("MyPrefsFile", Context.MODE_PRIVATE)
        val call: Call<Article> =
            RetroClient.getInstance().apiService.getArticle(
                prefs.getString("user_cookie", null),
                args.articleId
            )

        call.enqueue(object : Callback<Article> {
            @SuppressLint("ClickableViewAccessibility")
            override fun onResponse(call: Call<Article>, response: Response<Article>) {
                if (response.isSuccessful) {
                    val article: Article? = response.body()
                    title.text = article?.title
                    text.text = article?.text
                    val ss =SpannableString(text.text.toString())
                    var clickableSpan: ClickableSpan = object : ClickableSpan() {
                        override fun onClick(textView: View) {
                            //TODO create view of annotation.
                        }

                        override fun updateDrawState(ds: TextPaint) {
                            super.updateDrawState(ds)
                            ds.isUnderlineText = false
                            System.out.println("asd")

                        }
                    }

                    text.setMovementMethod(LinkMovementMethod.getInstance())
                    ss.setSpan(BackgroundColorSpan(Color.YELLOW),0,6,0)
                    ss.setSpan(clickableSpan,0,6, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
                    text.setText(ss,TextView.BufferType.SPANNABLE)
                    /*text.setCustomSelectionActionModeCallback(object :
                        ActionMode.Callback {
                        override fun onCreateActionMode(
                            mode: ActionMode,
                            menu: Menu?
                        ): Boolean {
                            mode.menuInflater.inflate(R.menu.anno_menu, menu)
                            return true
                        }

                        override fun onPrepareActionMode(
                            mode: ActionMode?,
                            menu: Menu?
                        ): Boolean {
                            return false
                        }

                        override fun onActionItemClicked(
                            mode: ActionMode,
                            item: MenuItem
                        ): Boolean {
                            if (item.getItemId() === R.id.annotate) {
                                val selStart: Int = text.getSelectionStart()
                                val selEnd: Int = text.getSelectionEnd()
                                mode.finish()
                                return true// annotateClicked(selStart, selEnd)
                            }
                            return false
                        }

                        override fun onDestroyActionMode(mode: ActionMode) {}
                    })*/
                    myVote.text="${myVote.text}${article?.yourRate}"
                    currentRate.text="${currentRate.text}${article?.rateAverage}"
                    totalVotes.text="${totalVotes.text}${article?.numberOfRates}"
                    setVisibility(article!!.userId!!)
                } else {
                    Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT)
                        .show()
                }
            }

            override fun onFailure(call: Call<Article>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })
    }
private fun refresh(){
    val call: Call<Article> =
        RetroClient.getInstance().apiService.getArticle(
            prefs.getString("user_cookie", null),
            args.articleId
        )

    call.enqueue(object : Callback<Article> {
        override fun onResponse(call: Call<Article>, response: Response<Article>) {
            if (response.isSuccessful) {
                val article: Article? = response.body()
                title.text = article?.title
                text.text = article?.text
                myVote.text="My Vote: ${article?.yourRate}"
                currentRate.text="Current Rate: ${article?.rateAverage}"
                totalVotes.text="Total Votes: ${article?.numberOfRates}"
                setVisibility(article!!.userId!!)
            } else {
                Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT)
                    .show()
            }
        }

        override fun onFailure(call: Call<Article>, t: Throwable) {
            Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
        }
    })
}
    private fun vote() {
        if(rate!=null){
        val call: Call<ResponseBody> =
            RetroClient.getInstance().apiService.rateArticle(
                prefs.getString("user_cookie", null),
                args.articleId, ArticleRateRequest(rate!!)
            )

        call.enqueue(object : Callback<ResponseBody> {
            override fun onResponse(
                call: Call<ResponseBody>,
                response: Response<ResponseBody>
            ) {
                if (response.isSuccessful) {
                    Toast.makeText(context, "Successful Vote", Toast.LENGTH_SHORT)
                        .show()
                    refresh()

                } else {
                    Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT)
                        .show()
                }
            }

            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })
    }}

    private fun setVisibility(userId: String) {
        if (userId == prefs.getString("userId", "")) {
            editButton.visibility = View.VISIBLE
            deleteButton.visibility = View.VISIBLE
            editButton.setOnClickListener { edit() }
            deleteButton.setOnClickListener {
                val call: Call<ResponseBody> =
                    RetroClient.getInstance().apiService.deleteArticle(
                        prefs.getString("user_cookie", null),
                        args.articleId
                    )

                call.enqueue(object : Callback<ResponseBody> {
                    override fun onResponse(
                        call: Call<ResponseBody>,
                        response: Response<ResponseBody>
                    ) {
                        if (response.isSuccessful) {
                            findNavController().popBackStack()

                        } else {
                            Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT)
                                .show()
                        }
                    }

                    override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                        Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
                    }
                })
            }

        }
    }

    private fun edit() {
        editButton.visibility = View.GONE
        deleteButton.visibility = View.GONE
        saveButton.visibility = View.VISIBLE
        saveButton.setOnClickListener {
            val call: Call<ResponseBody> =
                RetroClient.getInstance().apiService.editArticle(
                    prefs.getString("user_cookie", null),
                    args.articleId,
                    ArticleCreateRequest(text.text.toString(), title.text.toString() as String)
                )

            call.enqueue(object : Callback<ResponseBody> {
                override fun onResponse(
                    call: Call<ResponseBody>,
                    response: Response<ResponseBody>
                ) {
                    if (response.isSuccessful) {
                        editButton.visibility = View.VISIBLE
                        deleteButton.visibility = View.VISIBLE
                        saveButton.visibility = View.GONE
                        title.keyListener = null
                        text.keyListener = null
                    } else {
                        Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT)
                            .show()
                    }
                }

                override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                    Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
                }
            })
        }
        title.keyListener = title.getTag() as KeyListener
        text.keyListener = text.getTag() as KeyListener

    }


    override fun onNothingSelected(parent: AdapterView<*>?) {
    }

    override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
        rate = position + 1
    }
}