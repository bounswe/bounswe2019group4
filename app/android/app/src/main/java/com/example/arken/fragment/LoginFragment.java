package com.example.arken.fragment;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;

import com.example.arken.R;

public class LoginFragment extends Fragment implements View.OnClickListener {
    LinearLayout signupButton;
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_login, container, false);
        signupButton = view.findViewById(R.id.login_signupButton_layout);
        signupButton.setOnClickListener(this);
        ConstraintLayout layout = view.findViewById(R.id.login_background);
        layout.setOnClickListener(this);
        return view;
    }


    @Override
    public void onClick(View view) {
        if(view.getId()!=R.id.login_email_editText && view.getId()!=R.id.login_password_editText){
            InputMethodManager inputMethodManager = (InputMethodManager)getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);

        }
        if(view.getId() == R.id.login_signupButton_layout){
            SignupFragment nextFrag= new SignupFragment();
            getActivity().getSupportFragmentManager().beginTransaction()
                    .add(R.id.root_layout, nextFrag, "findThisFragment")
                    .addToBackStack(null)
                    .commit();
        }
    }
}
